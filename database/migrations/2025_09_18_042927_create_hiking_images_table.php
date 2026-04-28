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
        Schema::create('hiking_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('hiking_id'); // Foreign key to hikings table
            $table->string('image_path'); // Store path or filename of the image
            $table->timestamps();

            // Foreign Key Constraint
            $table->foreign('hiking_id')
                  ->references('id')
                  ->on('hikings')
                  ->onDelete('cascade'); // Cascade delete when related Hiking is removed
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hiking_images');
    }
};
