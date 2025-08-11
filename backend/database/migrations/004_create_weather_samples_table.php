<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('weather_samples', function (Blueprint $table) {
            $table->id();
            $table->foreignId('route_id')->nullable()->constrained()->onDelete('cascade');
            $table->decimal('latitude', 10, 6);
            $table->decimal('longitude', 11, 6);
            $table->timestamp('timestamp');
            $table->decimal('temperature', 5, 2)->nullable(); // Celsius
            $table->decimal('humidity', 5, 2)->nullable(); // Percentage
            $table->decimal('pressure', 7, 2)->nullable(); // hPa
            $table->decimal('wind_speed', 5, 2)->nullable(); // m/s
            $table->decimal('wind_direction', 5, 2)->nullable(); // degrees
            $table->decimal('wave_height', 5, 2)->nullable(); // meters
            $table->decimal('wave_period', 5, 2)->nullable(); // seconds
            $table->decimal('wave_direction', 5, 2)->nullable(); // degrees
            $table->decimal('visibility', 8, 2)->nullable(); // km
            $table->decimal('precipitation', 5, 2)->nullable(); // mm/h
            $table->decimal('cloud_cover', 5, 2)->nullable(); // percentage
            $table->string('source_api', 50);
            $table->json('raw_data')->nullable();
            $table->timestamps();

            // Indexes for efficient querying
            $table->index(['latitude', 'longitude']);
            $table->index(['timestamp']);
            $table->index(['route_id', 'timestamp']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('weather_samples');
    }
};