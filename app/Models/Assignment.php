<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Assignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'request_id',
        'volunteer_id',
        'assigned_by',
        'status',
    ];

    /**
     * Get the request for this assignment.
     */
    public function request()
    {
        return $this->belongsTo(Request::class);
    }

    /**
     * Get the volunteer assigned.
     */
    public function volunteer()
    {
        return $this->belongsTo(User::class, 'volunteer_id');
    }

    /**
     * Get the coordinator who made this assignment.
     */
    public function assigner()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
