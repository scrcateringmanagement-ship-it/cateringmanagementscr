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
        Schema::create('licensee_details_deletes', function (Blueprint $table) {
            $table->id();
            $table->string('Licensee_firm_name');
            $table->string('Licensee_name');
            $table->string('mobile');
            $table->string('pan');
            $table->string('type');
            $table->string('status');
            $table->string('zone');
            $table->string('division');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('licensee_details_deletes');
    }
};
