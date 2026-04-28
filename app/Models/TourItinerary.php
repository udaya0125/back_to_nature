<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TourItinerary extends Model
{
    //
     //
      protected $fillable = [
        'tour_id',
        'day',
        'title',
        'description'
    ];

    // Relationship: One itinerary belongs to one tour
    public function tour()
    {
        return $this->belongsTo(Tour::class);
    }
}
