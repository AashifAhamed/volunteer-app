<?php

namespace Tests\Feature;

use App\Models\Request as HelpRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MapIntegrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_map_endpoint_returns_requests(): void
    {
        $user = User::factory()->create(['status' => 'approved']);
        HelpRequest::factory()->count(5)->create();

        $response = $this->actingAs($user)->get('/api/map/requests');

        $response->assertStatus(200);
        $response->assertJsonCount(5);
    }

    public function test_map_endpoint_filters_by_district(): void
    {
        $user = User::factory()->create(['status' => 'approved']);
        HelpRequest::factory()->count(3)->create(['district' => 'Colombo']);
        HelpRequest::factory()->count(2)->create(['district' => 'Kandy']);

        $response = $this->actingAs($user)->get('/api/map/requests?district=Colombo');

        $response->assertStatus(200);
        $response->assertJsonCount(3);
        $response->assertJsonFragment(['district' => 'Colombo']);
    }

    public function test_map_endpoint_filters_by_status(): void
    {
        $user = User::factory()->create(['status' => 'approved']);
        HelpRequest::factory()->count(3)->create(['status' => 'verified']);
        HelpRequest::factory()->count(2)->create(['status' => 'unverified']);

        $response = $this->actingAs($user)->get('/api/map/requests?status=verified');

        $response->assertStatus(200);
        $response->assertJsonCount(3);
        $response->assertJsonFragment(['status' => 'verified']);
    }

    public function test_map_endpoint_filters_by_need_type(): void
    {
        $user = User::factory()->create(['status' => 'approved']);
        HelpRequest::factory()->count(3)->create(['type_of_need' => 'Medical Emergency']);
        HelpRequest::factory()->count(2)->create(['type_of_need' => 'Food/Water Needed']);

        $response = $this->actingAs($user)->get('/api/map/requests?type_of_need=Medical+Emergency');

        $response->assertStatus(200);
        $response->assertJsonCount(3);
        $response->assertJsonFragment(['type_of_need' => 'Medical Emergency']);
    }

    public function test_map_endpoint_includes_photos(): void
    {
        $user = User::factory()->create(['status' => 'approved']);
        $request = HelpRequest::factory()->create();
        $request->photos()->create(['photo_path' => 'test/photo.jpg']);

        $response = $this->actingAs($user)->get('/api/map/requests');

        $response->assertStatus(200);
        $response->assertJson(fn ($json) => 
            $json->has(0, fn ($item) => 
                $item->has('photos')
            )
        );
    }
}
