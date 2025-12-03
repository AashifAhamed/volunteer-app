<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_as_resident(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test Resident',
            'email' => 'resident@test.com',
            'phone' => '1234567890',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'resident',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'email' => 'resident@test.com',
            'role' => 'resident',
            'status' => 'approved',
        ]);
    }

    public function test_user_can_register_as_volunteer(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test Volunteer',
            'email' => 'volunteer@test.com',
            'phone' => '1234567891',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'volunteer',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'email' => 'volunteer@test.com',
            'role' => 'volunteer',
            'status' => 'pending',
        ]);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
            'status' => 'approved',
        ]);

        $response = $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        $this->assertAuthenticatedAs($user);
    }

    public function test_user_cannot_login_with_invalid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_user_can_logout(): void
    {
        $user = User::factory()->create([
            'status' => 'approved',
        ]);

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
    }

    public function test_pending_volunteer_cannot_access_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'volunteer',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertRedirect('/login');
    }

    public function test_approved_volunteer_can_access_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'volunteer',
            'status' => 'approved',
        ]);

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
    }

    public function test_coordinator_can_access_coordinator_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'coordinator',
            'status' => 'approved',
        ]);

        $response = $this->actingAs($user)->get('/coordinator/dashboard');

        $response->assertStatus(200);
    }

    public function test_non_coordinator_cannot_access_coordinator_dashboard(): void
    {
        $user = User::factory()->create([
            'role' => 'resident',
            'status' => 'approved',
        ]);

        $response = $this->actingAs($user)->get('/coordinator/dashboard');

        $response->assertStatus(403);
    }
}
