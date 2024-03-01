<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBillRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [

            //bill_masters

            'bill_no' => 'nullable|numeric',
            'total_qty' => 'required|numeric',
            'total_amount' => 'required|numeric',
            'disc_perc' => 'numeric|nullable',
            'disc_amount' => 'numeric|nullable',
            'customer_id' => 'nullable',
            'remarks' => 'string|nullable',
            'user_id' => 'required|exists:users,id',

            //bill_details

            'bill_details.*.code' => 'required|exists:job_works,code',
            'bill_details.*.qty' => 'required|numeric',
            'bill_details.*.rate' => 'required|numeric',
            'bill_details.*.amount' => 'required|numeric',
            'bill_details.*.disc_perc' => 'numeric|nullable',
            'bill_details.*.disc_value' => 'numeric|nullable',
            'bill_details.*.mrp' => 'numeric|required',
            'bill_details.*.old_bill_id' => 'numeric|nullable',
            'bill_details.*.bill_mode' => 'nullable|string',
            'bill_details.*.emp_code' => 'nullable|string',
            'bill_details.*.s_no' => 'nullable|numeric',

            //bill_settlements

            'cash' => 'numeric|required',
            'card' => 'numeric|required',
            'upi' => 'numeric|required',
            'return' => 'numeric|required',
        ];
    }
}
