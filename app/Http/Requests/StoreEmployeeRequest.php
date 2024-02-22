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
            'role' => 'nullable|string',
            'mobile' => 'nullable|string|max:10|min:10',
            'is_active' => 'nullable|boolean',
            'user_id' => 'required|exists:users,id'
        ];
    }
}
