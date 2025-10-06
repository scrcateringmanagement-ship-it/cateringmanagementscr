<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VandeBharatInspection extends Model
{
    use HasFactory;

    protected $fillable = [
        'official_id',
        'inspe_officer_official_name',
        'designation',
        'date_of_insp',
        'from_to',
        'short_service',
        'rail_neer_non_avail',
        'quality',
        'quantity',
        'hygiene',
        'miss_behave',
        'other_remarks',
        'pc_details', // JSON field
        'fine_imposed',
        'warned',
        'suitably_adv',
        'not_Substantiated',
        'resolved_adv',
        'any_other',
        'total',
    ];

    // ✅ Cast JSON to array automatically
    protected $casts = [
        'pc_details' => 'array',
    ];
}
