<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Room Types
        $roomTypes = [
            'Single Room' => 'A room designed for one person.',
            'Sharing Room' => 'A room designed for sharing between two or more people.',
            'Studio' => 'An open-concept room that combines sleeping and living areas.',
            'Ensuite' => 'A room with an attached private bathroom.',
            'Deluxe Room' => 'A larger, more premium room with additional amenities.',
        ];
        
        foreach ($roomTypes as $name => $description) {
            Category::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'type' => 'room_type',
                'description' => $description,
                'is_active' => true,
            ]);
        }
        
        // Facility Types
        $facilityTypes = [
            'Bathroom' => 'Bathroom related facilities.',
            'Kitchen' => 'Kitchen related facilities.',
            'Entertainment' => 'Entertainment related facilities.',
            'Connectivity' => 'Internet and network related facilities.',
            'Comfort' => 'Comfort related facilities.',
            'Security' => 'Security related facilities.',
            'Laundry' => 'Laundry related facilities.',
        ];
        
        foreach ($facilityTypes as $name => $description) {
            Category::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'type' => 'facility_type',
                'description' => $description,
                'is_active' => true,
            ]);
        }
        
        // Location Zones
        $locationZones = [
            'Central Jakarta' => 'Properties located in Central Jakarta.',
            'South Jakarta' => 'Properties located in South Jakarta.',
            'North Jakarta' => 'Properties located in North Jakarta.',
            'East Jakarta' => 'Properties located in East Jakarta.',
            'West Jakarta' => 'Properties located in West Jakarta.',
            'Campus Area' => 'Properties located near university or college campuses.',
            'Business District' => 'Properties located in or near business districts.',
            'Suburban' => 'Properties located in suburban areas.',
        ];
        
        foreach ($locationZones as $name => $description) {
            Category::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'type' => 'location_zone',
                'description' => $description,
                'is_active' => true,
            ]);
        }
    }
}
