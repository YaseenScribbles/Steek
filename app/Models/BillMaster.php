<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillMaster extends Model
{
    use HasFactory;

    protected $fillable = [
        'bill_no',
        'total_qty',
        'total_amount',
        'disc_perc',
        'disc_amount',
        'customer_id',
        'remarks',
        'user_id',
        'is_active',
    ];
}
