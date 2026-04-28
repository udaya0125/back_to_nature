<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrekkingImage extends Model
{
    protected $fillable = [
        'trekking_id',
        'image_path',
        'is_primary',
    ];

    public function trekking()
    {
        return $this->belongsTo(Trekking::class);
    }
}
