<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class login_detail extends Model
{
    use HasFactory;
    protected $fillable = [
       
        'loginid',
        'logtype',
        'transactiondatatime',
        'loginstatus',
        'logoutstatus',
    ];
}
