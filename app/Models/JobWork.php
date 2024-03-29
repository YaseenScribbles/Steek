<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobWork extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'description',
        'price',
        'user_id',
        'is_active',
    ];
}
