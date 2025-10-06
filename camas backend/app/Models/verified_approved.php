<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class verified_approved extends Model
{
    use HasFactory;
    protected $fillable = [
        'id_form_application',
        'cci_accpet',
        'cci_reject',
        'cci_signature',
        'cci_accpet_remarks',
        'cci_reject_remarks',
        'cci_date_time',
        'officer_accept',
        'officer_reject',
        'officer_signature',
        'officer_accpet_remarks',
        'officer_reject_remarks',
        'officer_date_time',
        'approver_accept',
        'approver_reject',
        'approver_signature',
        'approver_accpet_remarks',
        'approver_reject_remarks',
        'approver_date_time',
        ];
}
