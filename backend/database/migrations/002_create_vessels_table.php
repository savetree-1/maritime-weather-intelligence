<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('vessels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('imo_number')->unique()->nullable();
            $table->string('vessel_type');
            $table->decimal('length', 8, 2)->nullable();
            $table->decimal('beam', 8, 2)->nullable();
            $table->decimal('draft', 8, 2)->nullable();
            $table->decimal('gross_tonnage', 10, 2)->nullable();
            $table->decimal('deadweight', 10, 2)->nullable();
            $table->decimal('max_speed', 5, 2);
            $table->decimal('service_speed', 5, 2);
            $table->decimal('fuel_capacity', 10, 2);
            $table->decimal('fuel_consumption_rate', 8, 3);
            $table->string('fuel_type')->default('HFO');
            $table->json('specifications')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('vessels');
    }
};