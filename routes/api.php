<?php

use App\Http\Controllers\BillController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\JobWorkController;
use App\Http\Controllers\UserController;
use App\Http\Requests\BillRequest;
use App\Models\BillSettlement;
use App\Models\Customer;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResources([
        'jobwork' => JobWorkController::class,
        'customer' => CustomerController::class,
        'employee' => EmployeeController::class,
        'bill' => BillController::class,
        'user' => UserController::class,
    ]);

    Route::post('/logout', [UserController::class, 'logout']);

    Route::get('/dashboard', function (BillRequest $request) {

        try {
            $fromDate = $request->query('from_date');
            $toDate = $request->query('to_date');

            $billSettlement = BillSettlement::selectRaw('sum(cash-[return]) cash,sum(card) card,sum(upi) upi,sum(cash + card + upi - [return]) as settlement')
                ->join('bill_masters as m', function ($join) {
                    $join->on('m.id', '=', 'bill_settlements.bill_id')
                        ->where('m.is_active', 1);
                })
                ->whereDate('m.created_at', '>=', $fromDate)
                ->whereDate('m.created_at', '<=', $toDate)
                ->first();

            $employeeCount = Employee::where('is_active', 1)->count();
            $customerCount = Customer::where('is_active', 1)->count();

            // $bestEmployeesQuery  = "select coalesce(e.name,'UNSPECIFIED') employee, qty,amount from
            // (select d.emp_code,sum(d.qty) qty,sum(d.amount) amount
            // from bill_details d
            // inner join bill_masters m on m.id = d.bill_id and m.is_active = 1
            // and convert(date,m.created_at) between '2024-02-28' and '2024-03-04'
            // group by d.emp_code) a
            // left join (select e.code,e.name from employees e) e  on a.emp_code = e.code
            // order by amount desc";

            $bestEmployees = DB::table('bill_details as d')
                ->select(DB::raw("COALESCE(e.name,'UNSPECIFIED') as employee"), DB::raw('SUM(d.qty) as qty'), DB::raw('SUM(d.amount) as amount'))
                ->join('bill_masters as m', 'm.id', '=', 'd.bill_id')
                ->leftJoin('employees as e', 'd.emp_code', '=', 'e.code')
                ->where('m.is_active', 1)
                ->whereBetween(DB::raw('convert(date,m.created_at)'), [$fromDate, $toDate])
                ->groupBy('e.name')
                ->orderByDesc('amount')
                ->get();

            return response()->json(['settlement' => $billSettlement, 'employeeCount' => $employeeCount, 'customerCount' => $customerCount, 'bestEmployees' => $bestEmployees], 200);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    });
});

Route::post('/login', [UserController::class, 'login']);
Route::post('/user',[UserController::class,'store']);
