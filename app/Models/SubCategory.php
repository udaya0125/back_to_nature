<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class SubCategory extends Model
{
    protected $fillable = ['category_id', 'sub_category',];

    // SubCategory belongs to a Category
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // SubCategory has many tours
    public function tours(): HasMany
    {
        return $this->hasMany(Tour::class);
    }

    // SubCategory has many trekking
    public function trekking(): HasMany
    {
        return $this->hasMany(Trekking::class);
    }

    /**
     * A subcategory has many hikings
     */
    public function hikings(): HasMany
    {
        return $this->hasMany(Hiking::class);
    }

    
}