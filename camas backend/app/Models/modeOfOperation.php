<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class modeOfOperation extends Model
{
    use HasFactory;

    protected $table = 'mode_of_operation'; 

    protected $fillable = ['modeofoperation']; 

}
