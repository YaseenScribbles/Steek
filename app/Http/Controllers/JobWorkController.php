<?php

namespace App\Http\Controllers;

use App\Models\JobWork;
use App\Http\Requests\StoreJobWorkRequest;
use App\Http\Requests\UpdateJobWorkRequest;
use App\Http\Resources\JobWorkResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class JobWorkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $page = $request->query('page');

        if($page === "0"){
            $jobworks = JobWork::Where('is_active','=','1')->get();
        } else {
            $jobworks = JobWork::paginate(8);
        }

        return JobWorkResource::collection($jobworks);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreJobWorkRequest $request)
    {
        $data = $request->validated();

        $jobwork = JobWork::create($data);
        return response()->json(['message' => 'Jobwork added successfully', 'jobwork' => $jobwork], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(JobWork $jobwork)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateJobWorkRequest $request, JobWork $jobwork)
    {
        try {
            $data = $request->validated();
            $jobwork->update($data);
            return response()->json(['message' => 'Jobwork updated successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Error updating the job work: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while updating the job work'], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(JobWork $jobwork)
    {
        try {
            $jobwork->update(['is_active' => !$jobwork->is_active]);
            return response()->json(['message' => 'Jobwork deactivated successfully'], 200);
        } catch (\Exception $e) {
            Log::error('Error deactivating the job work: ' . $e->getMessage());
            return response()->json(['error' => 'An error deactivating the job work'], 500);
        }
    }
}
