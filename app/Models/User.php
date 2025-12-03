<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'nic',
        'district',
        'city',
        'skills',
        'availability',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'skills' => 'array',
    ];

    /**
     * Scope a query to only include residents.
     */
    public function scopeResidents($query)
    {
        return $query->where('role', 'resident');
    }

    /**
     * Scope a query to only include volunteers.
     */
    public function scopeVolunteers($query)
    {
        return $query->where('role', 'volunteer');
    }

    /**
     * Scope a query to only include coordinators.
     */
    public function scopeCoordinators($query)
    {
        return $query->where('role', 'coordinator');
    }

    /**
     * Scope a query to only include approved users.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Get the requests submitted by this resident.
     */
    public function requests()
    {
        return $this->hasMany(Request::class, 'resident_id');
    }

    /**
     * Get the requests assigned to this volunteer.
     */
    public function assignedRequests()
    {
        return $this->hasMany(Request::class, 'assigned_volunteer_id');
    }

    /**
     * Get the assignments for this volunteer.
     */
    public function assignments()
    {
        return $this->hasMany(Assignment::class, 'volunteer_id');
    }

    /**
     * Check if user is a coordinator.
     */
    public function isCoordinator()
    {
        return $this->role === 'coordinator';
    }

    /**
     * Check if user is a volunteer.
     */
    public function isVolunteer()
    {
        return $this->role === 'volunteer';
    }

    /**
     * Check if user is a resident.
     */
    public function isResident()
    {
        return $this->role === 'resident';
    }
}
