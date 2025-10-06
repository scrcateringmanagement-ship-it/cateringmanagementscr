<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\verified_approved;
use App\Helpers\CryptoHelper;


class FormApplication extends Model
{
    use HasFactory;
    protected $fillable = [
        'division',
        'blood_group',
        'zone',
        'first_name',
        'middle_initial',
        'last_name',
        'email',
        'gender',
        'civil_status',
        'position',
        'year',
        'name',
        'designation',
        'dob',
        'type_of_card',
        'aadhar_number',
        'phone_number',
        'address',
        'police_station',
        'police_cert_no',
        'police_cert_date',
        'medical_by',
        'medical_date',
        'medical_valid_upto',
        'last_paid_date',
        'licensee_remarks',
        'contract_code',
        'license_name',
        'location',
        'station',
        'date_of_application',
        'photo',
        'police_cert_file',
        'medical_cert_file',
        'aadhar_card_file',
        'vendor_signature_file',
        'money_receipt_file',
        'last_paid_file',
        'dd_mr_file',
        'station',
        'status_update',
        'licensee_id',
        'contract_details_start_date',
        'contract_details_end_date',
        'valid_upto',
        'annexure_two_file',
        'annexure_three_file'
    ];
    public function verifiedApproveds()
    {
        return $this->hasMany(verified_approved::class, 'id_form_application'); // or appropriate foreign key
    }

    /**
     * Encrypt Aadhaar before saving.
     */
    public function setAadharNumberAttribute($value)
    {
        $this->attributes['aadhar_number'] = CryptoHelper::encrypt($value);
        $this->attributes['aadhar_number_hash'] = self::generateAadhaarHash($value);
    }

    /**
     * Decrypt and return masked Aadhaar when retrieving.
     */
    public function getAadharNumberAttribute($value)
    {
        $decrypted = CryptoHelper::decrypt($value);
        return $decrypted ? CryptoHelper::maskAadhaar($decrypted) : null;
    }

    public static function generateAadhaarHash(string $aadhaar): string
    {
        return hash('sha256', $aadhaar);
    }

    /**
     * Optional method: Get full decrypted Aadhaar (for internal use only).
     */
    public function getFullAadhaar()
    {
        return CryptoHelper::decrypt($this->attributes['aadhar_number'] ?? '');
    }

    /**
     * Check if Aadhaar exists using hash (optimized).
     */
    public static function aadhaarExists(string $aadhaar): bool
    {
        $hash = self::generateAadhaarHash($aadhaar);
        return self::where('aadhar_number_hash', $hash)->exists();
    }
}
