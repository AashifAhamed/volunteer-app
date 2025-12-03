<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    use HasFactory;

    protected $fillable = [
        'resident_id',
        'name',
        'phone',
        'alternate_phone',
        'district',
        'address',
        'landmark',
        'coordinates',
        'type_of_need',
        'dynamic_fields_json',
        'status',
        'verified_by',
        'assigned_volunteer_id',
    ];

    protected $casts = [
        'coordinates' => 'array',
        'dynamic_fields_json' => 'array',
    ];

    /**
     * Get the resident who submitted this request.
     */
    public function resident()
    {
        return $this->belongsTo(User::class, 'resident_id');
    }

    /**
     * Get the coordinator who verified this request.
     */
    public function verifier()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Get the volunteer assigned to this request.
     */
    public function assignedVolunteer()
    {
        return $this->belongsTo(User::class, 'assigned_volunteer_id');
    }

    /**
     * Get the photos for this request.
     */
    public function photos()
    {
        return $this->hasMany(RequestPhoto::class);
    }

    /**
     * Get the assignments for this request.
     */
    public function assignments()
    {
        return $this->hasMany(Assignment::class);
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to filter by district.
     */
    public function scopeByDistrict($query, $district)
    {
        return $query->where('district', $district);
    }

    /**
     * Scope a query to filter by need type.
     */
    public function scopeByNeedType($query, $type)
    {
        return $query->where('type_of_need', $type);
    }
}
