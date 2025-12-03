<?php

namespace App\Http\Controllers;

use App\Models\Request as HelpRequest;
use App\Models\RequestPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HelpRequestController extends Controller
{
    public function create()
    {
        return Inertia::render('HelpRequest/Create');
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $isCoordinator = $user && $user->isCoordinator();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'alternate_phone' => ['nullable', 'string', 'max:20'],
            'district' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'landmark' => ['nullable', 'string', 'max:255'],
            'coordinates' => ['nullable', 'array'],
            'coordinates.lat' => ['nullable', 'numeric'],
            'coordinates.lng' => ['nullable', 'numeric'],
            'type_of_need' => ['required', 'string'],
            'dynamic_fields' => ['nullable'],
            'photos' => ['nullable', 'array', 'max:5'],
            'photos.*' => ['image', 'max:5120'], // 5MB max
        ]);

        // Parse dynamic_fields if it's a JSON string
        $dynamicFields = $validated['dynamic_fields'] ?? [];
        if (is_string($dynamicFields)) {
            $dynamicFields = json_decode($dynamicFields, true) ?? [];
        }
        if (!is_array($dynamicFields)) {
            $dynamicFields = [];
        }

        $helpRequest = HelpRequest::create([
            'resident_id' => $user ? $user->id : null,
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'alternate_phone' => $validated['alternate_phone'] ?? null,
            'district' => $validated['district'],
            'address' => $validated['address'] ?? null,
            'landmark' => $validated['landmark'] ?? null,
            'coordinates' => $validated['coordinates'] ?? null,
            'type_of_need' => $validated['type_of_need'],
            'dynamic_fields_json' => $dynamicFields,
            'status' => $isCoordinator ? 'verified' : 'unverified',
            'verified_by' => $isCoordinator ? $user->id : null,
        ]);

        // Handle photo uploads - Inertia sends files differently
        $photos = $request->allFiles();
        if (isset($photos['photos']) && is_array($photos['photos'])) {
            foreach ($photos['photos'] as $photo) {
                if ($photo->isValid()) {
                    $path = $photo->store('request-photos', 'public');
                    RequestPhoto::create([
                        'request_id' => $helpRequest->id,
                        'photo_path' => $path,
                    ]);
                }
            }
        }

        return redirect()->route('help-request.create')->with('success', 'Help request submitted successfully!');
    }

    public function index(Request $request)
    {
        $query = HelpRequest::with(['photos', 'resident', 'assignedVolunteer']);

        // Apply filters
        if ($request->has('district')) {
            $query->byDistrict($request->district);
        }
        if ($request->has('status')) {
            $query->byStatus($request->status);
        }
        if ($request->has('type_of_need')) {
            $query->byNeedType($request->type_of_need);
        }

        $requests = $query->latest()->paginate(20);

        return Inertia::render('HelpRequest/Index', [
            'requests' => $requests,
        ]);
    }
}
