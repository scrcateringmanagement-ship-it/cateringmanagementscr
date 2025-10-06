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
        Schema::create('verified_approveds', function (Blueprint $table) {
            $table->id();
            $table->text('id_form_application');
           $table->string('cci_signature');
           $table->string('cci_accpet_remarks');
            $table->string('cci_reject_remarks');
            $table->string('cci_date_time');
            $table->string('officer_signature');
            $table->string('officer_accpet_remarks');
            $table->string('officer_reject_remarks');
            $table->string('officer_date_time');
            $table->string('approver_signature');
            $table->string('approver_accpet_remarks');
            $table->string('approver_reject_remarks');
            $table->string('approver_date_time');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('verified_approveds');
    }
};
