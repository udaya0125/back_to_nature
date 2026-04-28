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
        Schema::create('tours', function (Blueprint $table) {
            $table->id();
            $table->string('title')->unique();
            $table->string('category_id');
            $table->string('sub_category_id');          
            $table->string('tour_type')->nullable();
            $table->longText('description')->nullable();                
            $table->longText('includes');
            $table->longText('excludes');
            $table->string('important_message');
            $table->string('best_time');
            $table->string('duration');
            $table->longText('city_covered');
            $table->string('season');          
            $table->string('slug')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tours');
    }
};
