<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInspectionRegistrationsTable extends Migration
{
    public function up()
    {
        Schema::create('inspection_registrations', function (Blueprint $table) {
            $table->id();

            $table->string('official_id'); 
            $table->string('unit_number');             
            $table->string('inspection_date');           
            $table->string('inspection_mode');         
            $table->string('train_number');           
            $table->string('station');                
            $table->string('section');                 
            $table->string('vendor_details');          
            $table->string('deficiency_details');        
            $table->string('deficiency_category');     
            $table->string('action_taken');            
            $table->decimal('fine_imposed');    
            $table->string('remarks');       

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('inspection_registrations');
    }
}
