<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class HikingItinerary extends Model
{
    use HasFactory;

    protected $fillable = [
        'hiking_id',   // foreign key to hiking
        'day',         // e.g., Day 1, Day 2
        'title',       // short title of the day
        'description', // details of the day's activities
    ];

    // Relationship to Hiking
    public function hiking()
    {
        return $this->belongsTo(Hiking::class);
    }
}
