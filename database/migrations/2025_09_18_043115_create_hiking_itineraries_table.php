<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('hiking_itineraries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hiking_id')
                  ->constrained('hikings')
                  ->onDelete('cascade');  // delete itineraries if hiking is deleted
            $table->string('day')->nullable();
            $table->string('title')->nullable();
            $table->longText('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hiking_itineraries');
    }
};
