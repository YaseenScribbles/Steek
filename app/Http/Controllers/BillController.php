<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBillRequest;
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
    public function index()
    {
        //
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
                $customer = Customer::create(['name' => $request->customer_name, 'mobile' => $request->customer_mobile,'user_id' => $request->user_id]);
                $customer_id = $customer->id;
            } else {
                $customer_id = $request->customer_id;
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
            return Response::json(['message' => 'Bill saved','billMaster' => $bill_master], 200);
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
        //
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
        //
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
