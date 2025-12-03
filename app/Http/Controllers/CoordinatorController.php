<?php

namespace App\Http\Controllers;

use App\Models\Request as HelpRequest;
use App\Models\User;
use App\Models\Assignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CoordinatorController extends Controller
{
    public function dashboard()
    {
        $requests = HelpRequest::with(['photos', 'resident', 'assignedVolunteer'])
            ->latest()
            ->paginate(20);

        $pendingVolunteers = User::volunteers()
            ->where('status', 'pending')
            ->count();

        $stats = [
            'total_requests' => HelpRequest::count(),
            'unverified_requests' => HelpRequest::where('status', 'unverified')->count(),
            'verified_requests' => HelpRequest::where('status', 'verified')->count(),
            'assigned_requests' => HelpRequest::where('status', 'volunteer_assigned')->count(),
            'resolved_requests' => HelpRequest::where('status', 'resolved')->count(),
            'pending_volunteers' => $pendingVolunteers,
        ];

        return Inertia::render('Coordinator/Dashboard', [
            'requests' => $requests,
            'stats' => $stats,
        ]);
    }

    public function volunteers()
    {
        $volunteers = User::volunteers()
            ->withCount('assignments')
            ->latest()
            ->paginate(20);

        return Inertia::render('Coordinator/Volunteers', [
            'volunteers' => $volunteers,
        ]);
    }

    public function approveVolunteer(User $user)
    {
        if ($user->role !== 'volunteer') {
            return back()->withErrors(['error' => 'User is not a volunteer']);
        }

        $user->update(['status' => 'approved']);

        return back()->with('success', 'Volunteer approved successfully');
    }

    public function rejectVolunteer(User $user)
    {
        if ($user->role !== 'volunteer') {
            return back()->withErrors(['error' => 'User is not a volunteer']);
        }

        $user->update(['status' => 'rejected']);

        return back()->with('success', 'Volunteer rejected');
    }

    public function verifyRequest(HelpRequest $request)
    {
        $request->update([
            'status' => 'verified',
            'verified_by' => Auth::id(),
        ]);

        return back()->with('success', 'Request verified successfully');
    }

    public function assignVolunteer(HelpRequest $helpRequest, User $volunteer)
    {
        if ($volunteer->role !== 'volunteer' || $volunteer->status !== 'approved') {
            return back()->withErrors(['error' => 'Invalid volunteer']);
        }

        $helpRequest->update([
            'status' => 'volunteer_assigned',
            'assigned_volunteer_id' => $volunteer->id,
        ]);

        Assignment::create([
            'request_id' => $helpRequest->id,
            'volunteer_id' => $volunteer->id,
            'assigned_by' => Auth::id(),
            'status' => 'pending',
        ]);

        return back()->with('success', 'Volunteer assigned successfully');
    }

    public function updateStatus(Request $httpRequest, HelpRequest $request)
    {
        $status = $httpRequest->input('status');
        $validStatuses = ['submitted', 'unverified', 'verified', 'volunteer_assigned', 'resolved'];
        
        if (!in_array($status, $validStatuses)) {
            return back()->withErrors(['error' => 'Invalid status']);
        }

        $request->update(['status' => $status]);

        return back()->with('success', 'Status updated successfully');
    }
}
