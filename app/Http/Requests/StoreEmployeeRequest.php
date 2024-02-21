<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
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
            'code' => 'string|required|unique:employees,code',
            'name' => 'string|required',
            'role' => 'string|required',
            'mobile' => 'string|max:10',
            'is_active' => 'boolean',
            'user_id' => 'required|exists:users,id'
        ];
    }
}
