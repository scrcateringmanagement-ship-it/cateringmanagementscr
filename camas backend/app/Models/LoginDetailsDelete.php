<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoginDetailsDelete extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'mobile',
        'loginid',
        'password',
        'type',
        'role',
        'userapp',
        'zone',
        'division',
        'firebase_key',
        'location',

    ];
}
