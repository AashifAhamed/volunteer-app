<?php

namespace Database\Factories;

use App\Models\Request;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Request>
 */
class RequestFactory extends Factory
{
    protected $model = Request::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'resident_id' => User::factory(),
            'name' => fake()->name(),
            'phone' => fake()->phoneNumber(),
            'district' => fake()->city(),
            'type_of_need' => fake()->randomElement([
                'Cleaning needed',
                'Medical Emergency',
                'Food/Water Needed',
                'Home Essentials Needed',
                'Missing Person',
                'Road/Outdoor Work',
                'Missing or Damaged Items',
                'Other',
            ]),
            'status' => 'unverified',
            'coordinates' => [
                'lat' => fake()->latitude(6, 10),
                'lng' => fake()->longitude(79, 82),
            ],
        ];
    }
}
