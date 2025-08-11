<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('filename');
            $table->string('original_name');
            $table->string('file_path');
            $table->bigInteger('file_size');
            $table->string('mime_type');
            $table->enum('document_type', ['sof', 'charter_party', 'voyage_order', 'other'])->default('other');
            $table->enum('ocr_status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->longText('extracted_text')->nullable();
            $table->json('parsed_clauses')->nullable();
            $table->json('processing_metadata')->nullable();
            $table->timestamp('uploaded_at');
            $table->timestamps();

            $table->index(['user_id', 'document_type']);
            $table->index(['ocr_status']);
            $table->index(['uploaded_at']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('documents');
    }
};