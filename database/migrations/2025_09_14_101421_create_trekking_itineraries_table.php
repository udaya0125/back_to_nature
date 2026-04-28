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
        Schema::create('trekking_itineraries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trekking_id')
                  ->constrained('trekkings')
                  ->onDelete('cascade'); // delete itinerary if trek is deleted
            $table->string('day')->nullable(); // example: Day 1, Day 2
            $table->string('title')->nullable(); // e.g., "Kathmandu Arrival"
            $table->longText('description')->nullable(); // detailed plan
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trekking_itineraries');
    }
};
