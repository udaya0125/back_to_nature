<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Hiking extends Model
{
    protected $fillable = [
        'title','description','included','excluded','category_id', 'sub_category_id',
        'what_to_bring','best_time_to_visit',
        'duration','elevation','season','slug'
    ];

    public function images()
    {
        return $this->hasMany(HikingImage::class);
    }

    public function itineraries()
    {
        return $this->hasMany(HikingItinerary::class);
    }

     // Relationship to Category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // Relationship to SubCategory
    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class);
    }

    /**
     * Boot method to handle slug creation & update.
     */
    protected static function boot()
{
    parent::boot();

    // Before creating a new Hiking record
    static::creating(function ($hiking) {
        if (empty($hiking->slug)) {
            // Use a temporary unique identifier if ID is not available yet
            $hiking->slug = Str::slug($hiking->title) . '-' . uniqid();
        }
    });

    // When updating the title, update the slug accordingly
    static::updating(function ($hiking) {
        if ($hiking->isDirty('title')) {
            $hiking->slug = Str::slug($hiking->title) . '-' . $hiking->id;
        }
    });
}

}
