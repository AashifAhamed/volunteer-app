<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class VolunteerController extends Controller
{
    public function create()
    {
        return Inertia::render('Volunteer/Register');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)],
            'phone' => ['required', 'string', 'max:20', Rule::unique(User::class)],
            'phone_whatsapp' => ['required', 'string', 'max:20'],
            'city' => ['required', 'string', 'max:255'],
            'district' => ['required', 'string', 'max:255'],
            'nic' => ['required', 'string', 'max:20', Rule::unique(User::class)],
            'skills' => ['required', 'array'],
            'skills.*' => ['string', 'in:Cleaning,Medical Support,Food/Water Distribution,Home Essentials,Outdoor/Road Work,Search & Missing Person Support,Other'],
            'availability' => ['required', 'string', 'in:Immediate,Within 24 hours,This week'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'nic' => $validated['nic'],
            'city' => $validated['city'],
            'district' => $validated['district'],
            'skills' => $validated['skills'],
            'availability' => $validated['availability'],
            'role' => 'volunteer',
            'status' => 'pending',
            'password' => Hash::make($validated['password']),
        ]);

        return redirect()->route('volunteer.register')->with('success', 'Registration submitted! A coordinator will review your application.');
    }
}
