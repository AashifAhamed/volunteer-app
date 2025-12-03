<?php

namespace Tests\Feature;

use App\Models\Request as HelpRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class HelpRequestTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');
    }

    public function test_resident_can_create_help_request(): void
    {
        $user = User::factory()->create([
            'role' => 'resident',
            'status' => 'approved',
        ]);

        $response = $this->actingAs($user)->post('/help-request', [
            'name' => 'John Doe',
            'phone' => '1234567890',
            'district' => 'Colombo',
            'type_of_need' => 'Food/Water Needed',
            'dynamic_fields' => [
                'adults_count' => 3,
                'children_count' => 2,
            ],
        ]);

        $this->assertDatabaseHas('requests', [
            'name' => 'John Doe',
            'type_of_need' => 'Food/Water Needed',
            'status' => 'unverified',
            'resident_id' => $user->id,
        ]);
    }

    public function test_coordinator_creates_verified_request(): void
    {
        $user = User::factory()->coordinator()->create();

        $response = $this->actingAs($user)->post('/help-request', [
            'name' => 'John Doe',
            'phone' => '1234567890',
            'district' => 'Colombo',
            'type_of_need' => 'Medical Emergency',
            'dynamic_fields' => [
                'medical_issue_type' => 'Injury',
                'ambulance_needed' => 'yes',
                'people_injured' => 1,
            ],
        ]);

        $this->assertDatabaseHas('requests', [
            'name' => 'John Doe',
            'status' => 'verified',
            'verified_by' => $user->id,
        ]);
    }

    public function test_help_request_can_include_photos(): void
    {
        $user = User::factory()->create([
            'role' => 'resident',
            'status' => 'approved',
        ]);

        $photos = [
            UploadedFile::fake()->image('photo1.jpg'),
            UploadedFile::fake()->image('photo2.jpg'),
        ];

        $response = $this->actingAs($user)->post('/help-request', [
            'name' => 'John Doe',
            'phone' => '1234567890',
            'district' => 'Colombo',
            'type_of_need' => 'Cleaning needed',
            'photos' => $photos,
        ]);

        $request = HelpRequest::where('name', 'John Doe')->first();
        $this->assertCount(2, $request->photos);
    }

    public function test_help_request_validates_max_photos(): void
    {
        $user = User::factory()->create([
            'role' => 'resident',
            'status' => 'approved',
        ]);

        $photos = array_fill(0, 6, UploadedFile::fake()->image('photo.jpg'));

        $response = $this->actingAs($user)->post('/help-request', [
            'name' => 'John Doe',
            'phone' => '1234567890',
            'district' => 'Colombo',
            'type_of_need' => 'Cleaning needed',
            'photos' => $photos,
        ]);

        $response->assertSessionHasErrors(['photos']);
    }

    public function test_help_request_can_include_gps_coordinates(): void
    {
        $user = User::factory()->create([
            'role' => 'resident',
            'status' => 'approved',
        ]);

        $response = $this->actingAs($user)->post('/help-request', [
            'name' => 'John Doe',
            'phone' => '1234567890',
            'district' => 'Colombo',
            'type_of_need' => 'Food/Water Needed',
            'coordinates' => [
                'lat' => 6.9271,
                'lng' => 79.8612,
            ],
        ]);

        $request = HelpRequest::where('name', 'John Doe')->first();
        $this->assertEquals(6.9271, $request->coordinates['lat']);
        $this->assertEquals(79.8612, $request->coordinates['lng']);
    }
}
