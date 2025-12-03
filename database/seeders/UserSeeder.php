<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Coordinators
        User::create([
            'name' => 'Admin Coordinator',
            'email' => 'coordinator@disasterrelief.lk',
            'phone' => '+94771234567',
            'password' => Hash::make('password'),
            'role' => 'coordinator',
            'status' => 'approved',
            'district' => 'Colombo',
            'city' => 'Colombo',
        ]);

        User::create([
            'name' => 'Regional Coordinator',
            'email' => 'regional@disasterrelief.lk',
            'phone' => '+94771234568',
            'password' => Hash::make('password'),
            'role' => 'coordinator',
            'status' => 'approved',
            'district' => 'Gampaha',
            'city' => 'Negombo',
        ]);

        // Create Approved Volunteers
        User::create([
            'name' => 'John Volunteer',
            'email' => 'volunteer1@example.com',
            'phone' => '+94771234569',
            'password' => Hash::make('password'),
            'role' => 'volunteer',
            'status' => 'approved',
            'district' => 'Colombo',
            'city' => 'Colombo',
            'skills' => ['first_aid', 'cooking', 'transportation'],
            'availability' => 'full_time',
        ]);

        User::create([
            'name' => 'Sarah Volunteer',
            'email' => 'volunteer2@example.com',
            'phone' => '+94771234570',
            'password' => Hash::make('password'),
            'role' => 'volunteer',
            'status' => 'approved',
            'district' => 'Gampaha',
            'city' => 'Negombo',
            'skills' => ['medical', 'counseling'],
            'availability' => 'part_time',
        ]);

        User::create([
            'name' => 'Michael Volunteer',
            'email' => 'volunteer3@example.com',
            'phone' => '+94771234571',
            'password' => Hash::make('password'),
            'role' => 'volunteer',
            'status' => 'approved',
            'district' => 'Kandy',
            'city' => 'Kandy',
            'skills' => ['construction', 'heavy_lifting'],
            'availability' => 'full_time',
        ]);

        // Create Pending Volunteers
        User::create([
            'name' => 'Pending Volunteer',
            'email' => 'pending.volunteer@example.com',
            'phone' => '+94771234572',
            'password' => Hash::make('password'),
            'role' => 'volunteer',
            'status' => 'pending',
            'district' => 'Colombo',
            'city' => 'Colombo',
            'skills' => ['first_aid'],
            'availability' => 'part_time',
        ]);

        // Create Residents
        User::create([
            'name' => 'Resident One',
            'email' => 'resident1@example.com',
            'phone' => '+94771234573',
            'password' => Hash::make('password'),
            'role' => 'resident',
            'status' => 'approved',
            'district' => 'Colombo',
            'city' => 'Colombo',
        ]);

        User::create([
            'name' => 'Resident Two',
            'email' => 'resident2@example.com',
            'phone' => '+94771234574',
            'password' => Hash::make('password'),
            'role' => 'resident',
            'status' => 'approved',
            'district' => 'Gampaha',
            'city' => 'Negombo',
        ]);

        User::create([
            'name' => 'Resident Three',
            'email' => 'resident3@example.com',
            'phone' => '+94771234575',
            'password' => Hash::make('password'),
            'role' => 'resident',
            'status' => 'approved',
            'district' => 'Kandy',
            'city' => 'Kandy',
        ]);

        $this->command->info('Sample users created successfully!');
        $this->command->info('Coordinators: coordinator@disasterrelief.lk, regional@disasterrelief.lk');
        $this->command->info('Volunteers: volunteer1@example.com, volunteer2@example.com, volunteer3@example.com');
        $this->command->info('Pending Volunteer: pending.volunteer@example.com');
        $this->command->info('Residents: resident1@example.com, resident2@example.com, resident3@example.com');
        $this->command->info('All passwords: password');
    }
}

