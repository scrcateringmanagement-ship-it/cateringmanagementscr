<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
      public function up(): void
    {
        Schema::create('pantry_cars', function (Blueprint $table) {
            $table->id();
            $table->integer('official_id');
            $table->string('inspe_officer_official_name');
            $table->string('designation');
            $table->date('date_of_inspe');
            $table->string('from_to');
            $table->string('coach_type');
            $table->json('pcm_details');
            $table->json('staff');
            $table->json('fassai');
            $table->json('availability_of_fire_safety');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pantry_cars');
    }
};
