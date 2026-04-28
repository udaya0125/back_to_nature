<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Tour extends Model
{
    protected $fillable = [
        'title', 'description', 'tour_type', 'includes', 'excludes', 
        'category_id', 'sub_category_id', 'important_message', 
        'best_time', 'duration', 'season', 
        'city_covered','things_to_remember','terms_for_booking', 'slug'
    ];

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

    // Relationship: One tour can have many images
    public function images()
    {
        return $this->hasMany(TourImage::class);
    }

    // Relationship: One tour can have many itineraries
    public function itinerary()
    {
        return $this->hasMany(TourItinerary::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($tour) {
            if (empty($tour->slug)) {
                $tour->slug = Str::slug($tour->title);
            }
        });

        static::created(function ($tour) {
            if (!Str::contains($tour->slug, (string)$tour->id)) {
                $tour->slug = $tour->slug . '-' . $tour->id;
                $tour->saveQuietly();
            }
        });

        static::updating(function ($tour) {
            if ($tour->isDirty('title')) {
                $tour->slug = Str::slug($tour->title) . '-' . $tour->id;
            }
        });
    }
}