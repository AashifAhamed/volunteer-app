<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VolunteerRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_volunteer_can_register_with_all_fields(): void
    {
        $response = $this->post('/volunteer/register', [
            'name' => 'John Volunteer',
            'email' => 'john@volunteer.com',
            'phone' => '1234567890',
            'phone_whatsapp' => '1234567890',
            'city' => 'Colombo',
            'district' => 'Colombo',
            'nic' => '123456789V',
            'skills' => ['Cleaning', 'Medical Support'],
            'availability' => 'Immediate',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john@volunteer.com',
            'role' => 'volunteer',
            'status' => 'pending',
            'city' => 'Colombo',
            'district' => 'Colombo',
        ]);
    }

    public function test_volunteer_registration_requires_all_fields(): void
    {
        $response = $this->post('/volunteer/register', [
            'name' => 'John Volunteer',
        ]);

        $response->assertSessionHasErrors(['email', 'phone', 'phone_whatsapp', 'city', 'district', 'nic', 'skills', 'availability', 'password']);
    }

    public function test_volunteer_registration_requires_valid_skills(): void
    {
        $response = $this->post('/volunteer/register', [
            'name' => 'John Volunteer',
            'email' => 'john@volunteer.com',
            'phone' => '1234567890',
            'phone_whatsapp' => '1234567890',
            'city' => 'Colombo',
            'district' => 'Colombo',
            'nic' => '123456789V',
            'skills' => ['Invalid Skill'],
            'availability' => 'Immediate',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(302); // Redirect on validation error
        $response->assertSessionHasErrors(); // Check that validation errors exist
    }

    public function test_volunteer_registration_requires_valid_availability(): void
    {
        $response = $this->post('/volunteer/register', [
            'name' => 'John Volunteer',
            'email' => 'john@volunteer.com',
            'phone' => '1234567890',
            'phone_whatsapp' => '1234567890',
            'city' => 'Colombo',
            'district' => 'Colombo',
            'nic' => '123456789V',
            'skills' => ['Cleaning'],
            'availability' => 'Invalid',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(302); // Redirect on validation error
        $response->assertSessionHasErrors(); // Check that validation errors exist
    }
}
