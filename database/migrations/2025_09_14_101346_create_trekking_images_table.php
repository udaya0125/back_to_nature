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
        Schema::create('trekking_images', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('trekking_id');
            $table->string('image_path'); // store image filename or path
            $table->boolean('is_primary')->default(false); // optional: mark cover image
            $table->timestamps();

            // Foreign key relation
            $table->foreign('trekking_id')
                  ->references('id')
                  ->on('trekkings')
                  ->onDelete('cascade'); // delete images when trekking is deleted
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trekking_images');
    }
};
