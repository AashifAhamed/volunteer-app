<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HelpRequestController;
use App\Http\Controllers\CoordinatorController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware(['auth:sanctum'])->group(function () {
    // Map data endpoint
    Route::get('/map/requests', function (Request $httpRequest) {
        $query = \App\Models\Request::with(['photos', 'resident', 'assignedVolunteer']);

        if ($httpRequest->has('district')) {
            $query->byDistrict($httpRequest->district);
        }
        if ($httpRequest->has('status')) {
            $query->byStatus($httpRequest->status);
        }
        if ($httpRequest->has('type_of_need')) {
            $query->byNeedType($httpRequest->type_of_need);
        }

        return $query->get();
    });

    // Request status update
    Route::post('/requests/{request}/status', [CoordinatorController::class, 'updateStatus'])
        ->middleware('role:coordinator');
});
