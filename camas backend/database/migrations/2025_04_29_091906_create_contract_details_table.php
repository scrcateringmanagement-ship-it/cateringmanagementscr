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
        Schema::create('contract_details', function (Blueprint $table) {
        $table->id();
        $table->string('Licensee_firm_name');
        $table->string('contract_id');
        $table->string('licensee_id');
        $table->string('contract_code');
        $table->string('Licensee_name');
        $table->string('Licensee_mobile');
        $table->string('Lincensee_pan');
        $table->string('Lincensee_type');
        $table->string('Lincensee_status');
        $table->string('Lincensee_zone');
        $table->string('Lincensee_division');
        $table->string('contract_station_name');
        $table->string('contract_stall');
        $table->string('contract_type');
        $table->string('contract_status');
        $table->string('contract_zone');
        $table->string('contract_division');
        $table->date('contract_details_start_date');
        $table->date('contract_details_end_date');
        $table->text('contract_details_activity');
        $table->text('contract_details_remarks');
        $table->string('contract_details_pay_mode');
        $table->string('contract_details_mode_of_operation');
        $table->integer('contract_details_no_of_employees');
        $table->string('contract_details_duration');
        $table->string('contract_details_award_status');
        $table->date('termination_date');
        $table->text('remarks')->nullable();
        $table->string('contract_location');
        $table->integer('current_count')->default(0);
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contract_details');
    }
};
