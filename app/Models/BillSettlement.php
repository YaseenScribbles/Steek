<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillSettlement extends Model
{
    use HasFactory;

    protected $fillable = [
        'bill_id',
        'cash',
        'card',
        'upi',
        'return',
    ];
}
