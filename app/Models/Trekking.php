<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Trekking extends Model
{
    protected $fillable = [
        'title',
        'category_id',
        'sub_category_id',
        'description',
        'includes',
        'excludes',
        'important_message',
        'best_time',
        'whatto_wear',
        'duration',
        'elevation',
        'grade',
        'season',
        'slug'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function subCategory()
    {
        return $this->belongsTo(SubCategory::class);
    }

    public function images()
    {
        return $this->hasMany(TrekkingImage::class);
    }

    public function itineraries()
    {
        return $this->hasMany(TrekkingItinerary::class);
    }

    protected static function boot()
    {
        parent::boot();

        // Before creating (slug placeholder)
        static::creating(function ($trekking) {
            if (empty($trekking->slug)) {
                $trekking->slug = Str::slug($trekking->title); // temporary
            }
        });

        // After creating (append ID for uniqueness)
        static::created(function ($trekking) {
            $baseSlug = Str::slug($trekking->title);
            $trekking->slug = $baseSlug . '-' . $trekking->id;
            $trekking->saveQuietly(); // avoid infinite loop
        });

        // Before updating (if title changes → regenerate slug)
        static::updating(function ($trekking) {
            if ($trekking->isDirty('title')) {
                $baseSlug = Str::slug($trekking->title);
                $trekking->slug = $baseSlug . '-' . $trekking->id;
            }
        });
    }
}