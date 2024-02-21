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

            'bill_no' => 'required|numeric',
            'total_qty' => 'required|numeric',
            'total_amount' => 'required|numeric',
            'disc_perc' => 'numeric',
            'disc_amount' => 'numeric',
            'customer_id' => 'exists:customers,id',
            'remarks' => 'string',
            'user_id' => 'required|exists:users,id',

            //bill_details

            'bill_details.*.code' => 'required|string',
            'bill_details.*.qty' => 'required|numeric',
            'bill_details.*.rate' => 'required|numeric',
            'bill_details.*.amount' => 'required|numeric',
            'bill_details.*.disc_perc' => 'numeric',
            'bill_details.*.disc_value' => 'numeric',
            'bill_details.*.mrp' => 'numeric|required',
            'bill_details.*.old_bill_id' => 'numeric',
            'bill_details.*.bill_mode' => 'required|string',
            'bill_details.*.s_no' => 'required|numeric',

            //bill_settlements

            'bill_settlements.*.mode' => 'string|required',
            'bill_settlements.*.paid' => 'numeric|required',
            'bill_settlements.*.return' => 'numeric|required',
        ];
    }
}
