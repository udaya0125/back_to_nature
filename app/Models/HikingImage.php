<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HikingImage extends Model
{
    protected $fillable = [
        'hiking_id',  // Foreign key to Hiking
        'image_path', // Path or URL of the image
        'caption'     // Optional: add captions or alt text
    ];

    /**
     * Relationship: Each image belongs to one Hiking.
     */
    public function hiking(): BelongsTo
    {
        return $this->belongsTo(Hiking::class);
    }
}
