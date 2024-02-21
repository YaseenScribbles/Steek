<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
            'name' => 'required|unique:users,name,'.$this->user->id,
            'email' => 'required|unique:users,email,'.$this->user->id,
            'password' => $this->isPasswordUpdate() ? 'required|confirmed|min:5' : 'nullable'
        ];
    }

    protected function isPasswordUpdate(){
        return !empty($this->password);
    }
}
