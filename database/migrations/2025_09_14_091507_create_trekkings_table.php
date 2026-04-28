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
        Schema::create('trekkings', function (Blueprint $table) {
            $table->id();
            $table->string('title')->unique();
            $table->string('category_id');
            $table->string('sub_category_id');
            $table->longText('description');
            $table->longText('includes');
            $table->longText('excludes');
            $table->longText('important_message');
            $table->longText('best_time');
            $table->longText('whatto_wear');
            $table->string('duration');
            $table->longText('elevation');
            $table->string('grade');
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
        Schema::dropIfExists('trekkings');
    }
};
