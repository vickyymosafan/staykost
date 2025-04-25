<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Facility;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FacilitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Bathroom Facilities
        $bathroomCategory = Category::where('name', 'Bathroom')->where('type', 'facility_type')->first();
        $bathroomFacilities = [
            'Private Bathroom' => ['Inside room bathroom', 'bathroom'],
            'Shared Bathroom' => ['Shared bathroom with other tenants', 'bathroom-shared'],
            'Hot Water' => ['Hot water shower available', 'hot-water'],
            'Shower' => ['Shower facility available', 'shower'],
            'Bathtub' => ['Bathtub available', 'bathtub'],
            'Toilet Seat' => ['Western-style toilet seat', 'toilet'],
        ];
        
        $this->createFacilities($bathroomFacilities, $bathroomCategory->id);
        
        // Kitchen Facilities
        $kitchenCategory = Category::where('name', 'Kitchen')->where('type', 'facility_type')->first();
        $kitchenFacilities = [
            'Private Kitchen' => ['Kitchen inside the room', 'kitchen'],
            'Shared Kitchen' => ['Shared kitchen with other tenants', 'kitchen-shared'],
            'Refrigerator' => ['Refrigerator available', 'fridge'],
            'Microwave' => ['Microwave available', 'microwave'],
            'Gas Stove' => ['Gas stove available', 'stove'],
            'Electric Stove' => ['Electric stove available', 'stove-electric'],
            'Kitchen Utensils' => ['Basic kitchen utensils provided', 'utensils'],
        ];
        
        $this->createFacilities($kitchenFacilities, $kitchenCategory->id);
        
        // Entertainment Facilities
        $entertainmentCategory = Category::where('name', 'Entertainment')->where('type', 'facility_type')->first();
        $entertainmentFacilities = [
            'TV' => ['Television available', 'tv'],
            'Cable TV' => ['Cable television service', 'tv-cable'],
            'Common Area' => ['Shared common area', 'common-area'],
            'Lounge' => ['Lounge area for relaxation', 'lounge'],
            'Gaming Room' => ['Room with gaming facilities', 'gaming'],
        ];
        
        $this->createFacilities($entertainmentFacilities, $entertainmentCategory->id);
        
        // Connectivity Facilities
        $connectivityCategory = Category::where('name', 'Connectivity')->where('type', 'facility_type')->first();
        $connectivityFacilities = [
            'WiFi' => ['Wireless internet available', 'wifi'],
            'High-Speed Internet' => ['Fast broadband internet', 'internet'],
            'LAN Connection' => ['Wired internet connection', 'lan'],
            'Telephone' => ['Telephone line available', 'phone'],
        ];
        
        $this->createFacilities($connectivityFacilities, $connectivityCategory->id);
        
        // Comfort Facilities
        $comfortCategory = Category::where('name', 'Comfort')->where('type', 'facility_type')->first();
        $comfortFacilities = [
            'Air Conditioning' => ['AC unit available', 'ac'],
            'Fan' => ['Electric fan available', 'fan'],
            'Heating' => ['Heating system available', 'heating'],
            'Bed' => ['Bed provided', 'bed'],
            'Desk' => ['Study/work desk provided', 'desk'],
            'Wardrobe' => ['Wardrobe/closet available', 'wardrobe'],
            'Balcony' => ['Private balcony available', 'balcony'],
        ];
        
        $this->createFacilities($comfortFacilities, $comfortCategory->id);
        
        // Security Facilities
        $securityCategory = Category::where('name', 'Security')->where('type', 'facility_type')->first();
        $securityFacilities = [
            'CCTV' => ['Security cameras installed', 'cctv'],
            'Security Guard' => ['24-hour security guard', 'guard'],
            'Key Card Access' => ['Electronic key card entry system', 'key-card'],
            'Fingerprint Access' => ['Biometric access system', 'fingerprint'],
            'Safe Box' => ['Personal safe box in room', 'safe'],
        ];
        
        $this->createFacilities($securityFacilities, $securityCategory->id);
        
        // Laundry Facilities
        $laundryCategory = Category::where('name', 'Laundry')->where('type', 'facility_type')->first();
        $laundryFacilities = [
            'Washing Machine' => ['Washing machine available', 'washing-machine'],
            'Dryer' => ['Clothes dryer available', 'dryer'],
            'Laundry Service' => ['Paid laundry service available', 'laundry-service'],
            'Iron' => ['Iron and ironing board available', 'iron'],
            'Clothesline' => ['Area for hanging clothes to dry', 'clothesline'],
        ];
        
        $this->createFacilities($laundryFacilities, $laundryCategory->id);
    }
    
    /**
     * Helper method to create facilities
     */
    private function createFacilities(array $facilities, int $categoryId): void
    {
        foreach ($facilities as $name => $details) {
            Facility::create([
                'category_id' => $categoryId,
                'name' => $name,
                'slug' => Str::slug($name),
                'description' => $details[0],
                'icon' => $details[1],
                'is_active' => true,
            ]);
        }
    }
}
