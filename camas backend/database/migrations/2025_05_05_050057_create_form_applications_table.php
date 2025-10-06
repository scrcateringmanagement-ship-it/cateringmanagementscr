<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('form_applications', function (Blueprint $table) {
            $table->id();
            $table->string('division');
            $table->string('zone');
            $table->string('first_name');
            $table->string('middle_initial');
            $table->string('last_name');
            $table->string('email');
            $table->string('blood_group');
            $table->string('gender');
            $table->string('civil_status');
            $table->string('position');
            $table->string('year');
            $table->string('name');
            $table->string('designation');
            $table->string('dob');
            $table->string('type_of_card');
            $table->string('aadhar_number');
            $table->string('phone_number');
            $table->string('address');
            $table->string('police_station');
            $table->string('police_cert_no');
            $table->string('police_cert_date');
            $table->string('medical_by');
            $table->string('medical_date');
            $table->string('medical_valid_upto');
            $table->string('last_paid_date');
            $table->string('licensee_remarks');
            $table->string('location');
            $table->string('date_of_application');
            $table->string('photo');
            $table->string('police_cert_file');
            $table->string('medical_cert_file');
            $table->string('annexure_two_file')->nullable();
            $table->string('annexure_three_file')->nullable();
            $table->string('aadhar_card_file');
            $table->string('vendor_signature_file');
            $table->string('money_receipt_file');
            $table->string('last_paid_file');
            $table->string('dd_mr_file');
            $table->string('contract_code');
            $table->string('license_name');
            $table->strig('station');
            $table->string('status_update');
            $table->int('licensee_id');
            $table->string('contract_details_start_date');
            $table->string('contract_details_end_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('form_applications');
    }
};
