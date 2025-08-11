<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Enable PostGIS extension
        DB::statement('CREATE EXTENSION IF NOT EXISTS postgis');

        Schema::create('routes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('vessel_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name');
            $table->string('origin_port');
            $table->string('destination_port');
            $table->json('geometry'); // GeoJSON LineString
            $table->decimal('distance_nm', 8, 2);
            $table->json('sample_points'); // Array of lat/lng points for weather sampling
            $table->decimal('estimated_duration_hours', 8, 2)->nullable();
            $table->enum('status', ['draft', 'active', 'completed', 'archived'])->default('draft');
            $table->timestamps();
        });

        // Add spatial index for better performance
        DB::statement('CREATE INDEX routes_geometry_idx ON routes USING GIST (ST_GeomFromGeoJSON(geometry))');
    }

    public function down()
    {
        Schema::dropIfExists('routes');
    }
};