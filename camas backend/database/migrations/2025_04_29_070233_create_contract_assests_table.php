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
        Schema::create('contract_assests', function (Blueprint $table) {
            $table->id();
            $table->string('contract_code');
            $table->string('station_name');
            $table->string('stall');
            $table->string('type');
            $table->string('status');
            $table->string('zone');
            $table->string('division');
            $table->string('contract_details_award_status');
            $table->string('contract_location');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contract_assests');
    }
};
