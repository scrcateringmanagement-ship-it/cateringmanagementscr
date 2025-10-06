<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    use HasFactory;

    protected $table = 'status'; // Important because your table is named 'status'

    protected $fillable = ['status']; // Allow mass assignment for 'status' field
}
