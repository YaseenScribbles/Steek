<?php

namespace App\Http\Controllers;

use App\Http\Requests\BillRequest;
use App\Http\Requests\StoreBillRequest;
use App\Http\Resources\BillResource;
use App\Models\BillDetail;
use App\Models\BillMaster;
use App\Models\BillSettlement;
use App\Models\Customer;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;

class BillController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(BillRequest $request)
    {
        $from_date = $request->query('from_date');
        $to_date = $request->query('to_date');

        $billsQuery = BillMaster::from('bill_masters as b')
            ->select('b.id', 'b.bill_no', 'b.created_at as bill_date', 'b.total_qty', 'b.total_amount', DB::raw("coalesce(c.name,'') as customer"), 'u.name as user', 'b.is_active')
            ->leftJoin('customers as c', function ($join) {
                $join->on('b.customer_id', '=', 'c.id');
            })
            ->whereDate('b.created_at', '>=', $from_date)
            ->whereDate('b.created_at', '<=', $to_date)
            ->join('users as u', 'b.user_id', '=', 'u.id');

        $sql = $billsQuery->toSql();
        Log::info([$sql,$from_date,$to_date]);

        $bills = $billsQuery->paginate(8);
        return BillResource::collection($bills);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBillRequest $request)
    {
        try {
            // Begin transaction
            DB::beginTransaction();

            // Validating request
            $data = $request->validated();

            // Retrieving settings
            $begin_date = Setting::where('key', 'begin_date')->value('value');
            $end_date = Setting::where('key', 'end_date')->value('value');
            $bill_prefix = Setting::where('key', 'bill_prefix')->value('value');
            $financial_duration = $this->getFinancialYear();

            // Calculating bill number
            $next_bill_no = BillMaster::whereBetween('created_at', [$begin_date, $end_date])->count() + 1;
            $bill_no = $bill_prefix . $financial_duration . '-' . $next_bill_no;
            $customer_id = 0;

            if ($request->customer_id === 0 && $request->customer_mobile) {
                $customer = Customer::create(['name' => $request->customer_name, 'mobile' => $request->customer_mobile, 'user_id' => $request->user_id]);
                $customer_id = $customer->id;
            } else if ($request->customer_id) {
                $customer_id = $request->customer_id;
                $customer = Customer::find($customer_id);
                if (strtoupper($request->customer_name) !== strtoupper($customer->name) || strtoupper($request->customer_mobile) !== strtoupper($customer->mobile)) {
                    $customer->update([
                        'name' => $request->customer_name,
                        'mobile' => $request->customer_mobile
                    ]);
                }
            }

            // Creating bill master
            $bill_master = BillMaster::create([
                'bill_no' => $bill_no,
                'total_qty' => $request->total_qty,
                'total_amount' => $request->total_amount,
                'disc_perc' => $request->disc_perc,
                'disc_amount' => $request->disc_amount,
                'customer_id' => $customer_id,
                'remarks' => $request->remarks,
                'user_id' => $request->user_id,
            ]);

            // Creating bill details
            foreach ($request->bill_details as $key => $detailData) {
                BillDetail::create([
                    'bill_id' => $bill_master->id,
                    'code' => $detailData['code'],
                    'qty' => $detailData['qty'],
                    'rate' => $detailData['rate'],
                    'amount' => $detailData['amount'],
                    'disc_perc' => $detailData['disc_perc'],
                    'disc_value' => $detailData['disc_value'],
                    'mrp' => $detailData['mrp'],
                    'emp_code' => $detailData['emp_code'],
                    's_no' => $key + 1
                ]);
            }

            // Creating bill settlement
            BillSettlement::create([
                'bill_id' => $bill_master->id,
                'cash' => $request->cash,
                'card' => $request->card,
                'upi' => $request->upi,
                'return' => $request->return
            ]);

            // Commit transaction
            DB::commit();

            // Return success response
            return Response::json(['message' => 'Bill saved', 'billMaster' => $bill_master], 200);
        } catch (\Throwable $e) {
            // Rollback transaction
            DB::rollBack();

            // Return error response
            return Response::json(['message' => 'Failed to save bill', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            //code...
            $billMasters = BillMaster::find($id);
            $billDetailsQuery = BillDetail::from('bill_details as d')
                ->select('d.rate', 'd.qty', 'd.amount', 'j.description')
                ->join('job_works as j', function ($join) {
                    $join->on('j.code', '=', 'd.code');
                })
                ->where('d.bill_id', $id);
            $billDetails = $billDetailsQuery->get();
            $billSettlements = BillSettlement::where('bill_id', '=', $id)->get();
            $customer = '';

            Log::info($billDetailsQuery->toSql());

            if ($billMasters->customer_id) {
                $customer = Customer::find($billMasters->customer_id);
            }

            return response()->json(['billMasters' => $billMasters, 'billDetails' => $billDetails, 'billSettlements' => $billSettlements, 'customer' => $customer], 200);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['message' => 'Error fetching bill'], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            //code...
            $bill = BillMaster::find($id);
            $bill->update([
                'is_active' => !($bill->is_active)
            ]);
            return response()->json(['message' => 'Updated successfully'], 200);
        } catch (\Throwable $th) {
            //throw $th;
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function getFinancialYear()
    {
        $year = date('Y');
        $month = date('m');

        if ($month < 4) {
            $financialYearStart = $year - 1;
            $financialYearEnd = $year;
        } else {
            $financialYearStart = $year;
            $financialYearEnd = $year + 1;
        }

        return substr($financialYearStart, -2) . substr($financialYearEnd, -2);
    }
}
