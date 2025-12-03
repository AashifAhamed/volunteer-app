<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\VolunteerController;
use App\Http\Controllers\HelpRequestController;
use App\Http\Controllers\CoordinatorController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

Route::middleware(['guest'])->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);
    
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Volunteer registration
    Route::get('/volunteer/register', [VolunteerController::class, 'create'])->name('volunteer.register');
    Route::post('/volunteer/register', [VolunteerController::class, 'store'])->name('volunteer.register.store');
    
    // Help requests
    Route::get('/help-request', [HelpRequestController::class, 'index'])->name('help-request.index');
    Route::get('/help-request/create', [HelpRequestController::class, 'create'])->name('help-request.create');
    Route::post('/help-request', [HelpRequestController::class, 'store'])->name('help-request.store');
    
    // Coordinator routes
    Route::middleware(['role:coordinator'])->group(function () {
        Route::get('/coordinator/dashboard', [CoordinatorController::class, 'dashboard'])->name('coordinator.dashboard');
        Route::get('/coordinator/volunteers', [CoordinatorController::class, 'volunteers'])->name('coordinator.volunteers');
        Route::post('/coordinator/volunteers/{user}/approve', [CoordinatorController::class, 'approveVolunteer'])->name('coordinator.volunteers.approve');
        Route::post('/coordinator/volunteers/{user}/reject', [CoordinatorController::class, 'rejectVolunteer'])->name('coordinator.volunteers.reject');
        Route::post('/coordinator/requests/{request}/verify', [CoordinatorController::class, 'verifyRequest'])->name('coordinator.requests.verify');
        Route::post('/coordinator/requests/{request}/assign/{volunteer}', [CoordinatorController::class, 'assignVolunteer'])->name('coordinator.requests.assign');
        Route::post('/coordinator/requests/{request}/status', [CoordinatorController::class, 'updateStatus'])->name('coordinator.requests.status');
    });
});
