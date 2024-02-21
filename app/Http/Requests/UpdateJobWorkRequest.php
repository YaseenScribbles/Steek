<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateJobWorkRequest extends FormRequest
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

        // Retrieve the job work ID from the URL
        $id = $this->segment(count($this->segments()));

        return [
            'code' => 'required|string|unique:job_works,code,'. $id . ',id',
            'description' => 'required|string|unique:job_works,description,'. $id . ',id',
            'price' => 'numeric|required',
            'user_id' => 'required|exists:users,id',
            'is_active' => 'nullable|boolean'
        ];
    }
}
