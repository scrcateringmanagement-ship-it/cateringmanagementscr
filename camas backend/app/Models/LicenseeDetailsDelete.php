<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LicenseeDetailsDelete extends Model
{
    use HasFactory;

    protected $fillable = [
        'Licensee_firm_name',
        'Licensee_name',
        'mobile',
        'pan',
        'type',
        'status',
        'zone',
        'division',
    ];
}
