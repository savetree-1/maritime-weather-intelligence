<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('vessel_id')->constrained()->onDelete('cascade');
            $table->foreignId('route_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->timestamp('departure_time');
            $table->timestamp('arrival_time')->nullable();
            $table->enum('optimization_type', ['fuel', 'time', 'safety', 'balanced'])->default('balanced');
            $table->json('speed_recommendations'); // Array of speed recommendations per route segment
            $table->decimal('fuel_consumption_estimate', 10, 2)->nullable();
            $table->decimal('total_cost', 12, 2)->nullable();
            $table->decimal('safety_score', 3, 2)->nullable(); // 0-100 score
            $table->json('weather_conditions')->nullable();
            $table->text('explanation')->nullable();
            $table->enum('status', ['draft', 'active', 'completed', 'cancelled'])->default('draft');
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['departure_time']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('plans');
    }
};