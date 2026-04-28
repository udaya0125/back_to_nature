<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrekkingItinerary extends Model
{
    protected $fillable = [
        'trekking_id',
        'day',
        'title',
        'description',
    ];

    public function trekking()
    {
        return $this->belongsTo(Trekking::class);
    }
}
