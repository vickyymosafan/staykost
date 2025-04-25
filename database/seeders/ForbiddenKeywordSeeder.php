<?php

namespace Database\Seeders;

use App\Models\ForbiddenKeyword;
use Illuminate\Database\Seeder;

class ForbiddenKeywordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // High severity keywords (automatic rejection)
        $highSeverityKeywords = [
            'scam' => null,
            'illegal' => null,
            'narcotics' => 'prohibited items',
            'drugs' => 'prohibited items',
            'weapons' => 'prohibited items',
            'gambling' => 'prohibited activities',
            'call girl' => 'prohibited services',
            'prostitution' => 'prohibited services',
        ];
        
        foreach ($highSeverityKeywords as $keyword => $replacement) {
            ForbiddenKeyword::create([
                'keyword' => $keyword,
                'replacement' => $replacement,
                'severity' => 'high',
                'is_active' => true,
            ]);
        }
        
        // Medium severity keywords (flagged for review)
        $mediumSeverityKeywords = [
            'alcohol' => 'beverages',
            'cheap' => 'affordable',
            'dirty' => 'needs maintenance',
            'nasty' => 'unpleasant',
            'sketchy' => 'uncertain',
            'suspicious' => 'concerning',
            'party' => 'gathering',
        ];
        
        foreach ($mediumSeverityKeywords as $keyword => $replacement) {
            ForbiddenKeyword::create([
                'keyword' => $keyword,
                'replacement' => $replacement,
                'severity' => 'medium',
                'is_active' => true,
            ]);
        }
        
        // Low severity keywords (auto-replace but no flagging)
        $lowSeverityKeywords = [
            'bad' => 'unpleasant',
            'terrible' => 'challenging',
            'noisy' => 'lively',
            'old' => 'classic',
            'ugly' => 'unique-looking',
            'basic' => 'standard',
            'simple' => 'straightforward',
        ];
        
        foreach ($lowSeverityKeywords as $keyword => $replacement) {
            ForbiddenKeyword::create([
                'keyword' => $keyword,
                'replacement' => $replacement,
                'severity' => 'low',
                'is_active' => true,
            ]);
        }
    }
}
