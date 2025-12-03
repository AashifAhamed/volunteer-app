<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RequestPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'request_id',
        'photo_path',
    ];

    /**
     * Get the request that owns this photo.
     */
    public function request()
    {
        return $this->belongsTo(Request::class);
    }
}
