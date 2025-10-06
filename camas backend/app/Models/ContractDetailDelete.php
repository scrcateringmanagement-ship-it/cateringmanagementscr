<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContractDetailDelete extends Model
{
    use HasFactory;

    protected $fillable = [
        'Licensee_firm_name',
        'contract_id',
        'licensee_id',
        'contract_code', 
        'Licensee_name',
        'Licensee_mobile',
        'Lincensee_pan',
        'Lincensee_type',
        'Lincensee_status',
        'Lincensee_zone',
        'Lincensee_division',
        'contract_station_name',
        'contract_stall',
        'contract_type',
        'contract_status',
        'contract_zone',
        'contract_division',
        'contract_details_start_date',
        'contract_details_end_date',
        'contract_details_activity',
        'contract_details_remarks',
        'contract_details_mode_of_operation',
        'contract_details_no_of_employees',
        'contract_details_duration',
        'contract_details_award_status',
        'termination_date',
        'contract_location',
        'remarks',
        'managermobile'
    ];
    
}
