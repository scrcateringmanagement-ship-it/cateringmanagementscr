<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PantryCar extends Model
{
    use HasFactory;

    protected $fillable = [
        'official_id',
        'inspe_officer_official_name',
        'designation',
        'date_of_inspe',
        'from_to',
        'coach_type',
        'pcm_details',
        'staff',
        'fassai',
        'availability_of_fire_safety'
    ];
    protected $casts = [
        'pcm_details' => 'json',
        'staff' => 'json',
        'fassai' => 'json',
        'availability_of_fire_safety' => 'json'
    ];
}
