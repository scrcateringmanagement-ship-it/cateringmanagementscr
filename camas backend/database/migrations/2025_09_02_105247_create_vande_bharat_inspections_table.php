<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('vande_bharat_inspections', function (Blueprint $table) {
            $table->id();
            $table->text('official_id')->nullable();
            $table->text('inspe_officer_official_name')->nullable();
            $table->integer('designation')->default(0);
            $table->date('date_of_insp');
            $table->string('from_to');
            $table->text('short_service')->nullable();
            $table->text('rail_neer_non_avail')->nullable();
            $table->text('quality')->nullable();
            $table->text('quantity')->nullable();
            $table->text('hygiene')->nullable();
            $table->text('miss_behave')->nullable();
            $table->text('other_remarks')->nullable();
            $table->json('pc_details')->nullable();
            $table->integer('fine_imposed')->default(0);
            $table->text('warned')->nullable();
            $table->text('suitably_adv')->nullable();
            $table->text('not_Substantiated')->nullable();
            $table->text('resolved_adv')->nullable();
            $table->text('any_other')->nullable();
            $table->integer('total')->default(0);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vande_bharat_inspections');
    }
};
