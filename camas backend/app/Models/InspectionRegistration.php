<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
class InspectionRegistration extends Model
{
    use HasFactory;

    protected $fillable = [
        'official_id',
        'unit_number',
        'inspection_date',
        'inspection_mode',
        'train_number',
        'station',
        'section',
        'deficiency_details',
        'deficiency_category',
        'action_taken',
        'fine_imposed',
        'action_remarks',
        'vendor_name',
        'vendor_id',
        'vendor_aadhar',
        'licensee_name',
        'licensee_number',
        'licensee_division',
        'status_update',      // ✅ Add this
        'paidstatus',   
        'paymentDate',   
        'recieptNumber',// ✅ And this
        'paidAmount',
        'paidLocation',
        'prosecutionAmount',
        'zone',
        'division',
        'fowardingRemarks',
        'forwardingID',
        'returnRemarks',
    ];
    public function official()
{
    return $this->belongsTo(User::class, 'official_id', 'id');
}
}
