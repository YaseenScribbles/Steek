<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BillResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'billNo' => $this->bill_no,
            'billDate' => $this->bill_date,
            'totalQty' => $this->total_qty,
            'totalAmount' => $this->total_amount,
            'customer' => $this->customer,
            'user' => $this->user,
            'active' => $this->is_active
        ];
    }
}
