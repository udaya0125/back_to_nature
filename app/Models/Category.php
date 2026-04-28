<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Category extends Model
{
    protected $fillable = ['category'];

    // One category has many subcategories
    public function subCategories(): HasMany
    {
        return $this->hasMany(SubCategory::class, 'category_id');
    }

    // One category has many tours
    public function tours(): HasMany
    {
        return $this->hasMany(Tour::class);
    }

    // One category has many trekking
    public function trekking(): HasMany
    {
        return $this->hasMany(Trekking::class);
    }

    /**
     * A category has many hikings
     */
    public function hikings(): HasMany
    {
        return $this->hasMany(Hiking::class);
    }
   
}