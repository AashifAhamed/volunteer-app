<?php

namespace Tests\Feature;

use App\Models\Request as HelpRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CoordinatorDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_coordinator_can_view_dashboard(): void
    {
        $coordinator = User::factory()->coordinator()->create();

        $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');

        $response->assertStatus(200);
    }

    public function test_coordinator_can_approve_volunteer(): void
    {
        $coordinator = User::factory()->coordinator()->create();
        $volunteer = User::factory()->volunteer()->create();

        $response = $this->actingAs($coordinator)
            ->post("/coordinator/volunteers/{$volunteer->id}/approve");

        $this->assertDatabaseHas('users', [
            'id' => $volunteer->id,
            'status' => 'approved',
        ]);
    }

    public function test_coordinator_can_reject_volunteer(): void
    {
        $coordinator = User::factory()->coordinator()->create();
        $volunteer = User::factory()->volunteer()->create();

        $response = $this->actingAs($coordinator)
            ->post("/coordinator/volunteers/{$volunteer->id}/reject");

        $this->assertDatabaseHas('users', [
            'id' => $volunteer->id,
            'status' => 'rejected',
        ]);
    }

    public function test_coordinator_can_verify_request(): void
    {
        $coordinator = User::factory()->coordinator()->create();
        $request = HelpRequest::factory()->create(['status' => 'unverified']);

        $response = $this->actingAs($coordinator)
            ->post("/coordinator/requests/{$request->id}/verify");

        $this->assertDatabaseHas('requests', [
            'id' => $request->id,
            'status' => 'verified',
            'verified_by' => $coordinator->id,
        ]);
    }

    public function test_coordinator_can_assign_volunteer_to_request(): void
    {
        $coordinator = User::factory()->coordinator()->create();
        $volunteer = User::factory()->volunteer()->create(['status' => 'approved']);
        $request = HelpRequest::factory()->create(['status' => 'verified']);

        $response = $this->actingAs($coordinator)
            ->post("/coordinator/requests/{$request->id}/assign/{$volunteer->id}");

        $this->assertDatabaseHas('requests', [
            'id' => $request->id,
            'status' => 'volunteer_assigned',
            'assigned_volunteer_id' => $volunteer->id,
        ]);

        $this->assertDatabaseHas('assignments', [
            'request_id' => $request->id,
            'volunteer_id' => $volunteer->id,
            'assigned_by' => $coordinator->id,
        ]);
    }

    public function test_coordinator_can_update_request_status(): void
    {
        $coordinator = User::factory()->coordinator()->create();
        $request = HelpRequest::factory()->create(['status' => 'verified']);

        $response = $this->actingAs($coordinator)
            ->post("/coordinator/requests/{$request->id}/status", [
                'status' => 'resolved',
            ]);

        $this->assertDatabaseHas('requests', [
            'id' => $request->id,
            'status' => 'resolved',
        ]);
    }

    public function test_dashboard_shows_correct_statistics(): void
    {
        $coordinator = User::factory()->coordinator()->create();
        
        HelpRequest::factory()->count(5)->create(['status' => 'unverified']);
        HelpRequest::factory()->count(3)->create(['status' => 'verified']);
        HelpRequest::factory()->count(2)->create(['status' => 'resolved']);

        $response = $this->actingAs($coordinator)->get('/coordinator/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Coordinator/Dashboard')
            ->has('stats', fn ($stats) => 
                $stats->where('total_requests', 10)
                    ->where('unverified_requests', 5)
                    ->where('verified_requests', 3)
                    ->where('resolved_requests', 2)
            )
        );
    }
}
