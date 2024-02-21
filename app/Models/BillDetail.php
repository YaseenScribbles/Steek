<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'bill_id',
        'code',
        'qty',
        'rate',
        'amount',
        'disc_perc',
        'disc_value',
        'mrp',
        'old_bill_id',
        'bill_mode',
        's_no'
    ];
}
