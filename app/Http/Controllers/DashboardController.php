<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // Check if user is approved
        if ($user->status !== 'approved') {
            Auth::logout();
            return redirect()->route('login')->withErrors(['message' => 'Your account is pending approval.']);
        }
        
        if ($user->isCoordinator()) {
            return redirect()->route('coordinator.dashboard');
        }

        return Inertia::render('Dashboard/Index', [
            'user' => $user,
        ]);
    }
}
