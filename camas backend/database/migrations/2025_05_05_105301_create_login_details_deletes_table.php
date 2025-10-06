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
        Schema::create('login_details_deletes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('mobile');
            $table->string('loginid');
            $table->string('password');
            $table->string('type');
            $table->string('role'); 
            $table->string('userapp');   
            $table->string('zone');
            $table->string('division');
            $table->string('location');
            $table->string('firebase_key');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('login_details_deletes');
    }
};
