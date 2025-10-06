<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContractAssestsDetailsDelete extends Model
{
    use HasFactory;
    protected $fillable = [
        'contract_id',    
        'contract_code',
        'station_name',
        'stall',
        'type',
        'status',
        'zone',
        'division',
        'contract_details_award_status',
        'contract_location',
    ];
}
