<?php

namespace App\Services;

use App\Models\ContentFlag;
use App\Models\ForbiddenKeyword;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;

class ContentModerationService
{
    /**
     * Check text content for forbidden keywords and flag if found
     * 
     * @param Model $model The model to be checked and potentially flagged
     * @param string $content The text content to check
     * @param int|null $reportedBy User ID who reported the content (if manually reported)
     * @return Collection Collection of found keywords
     */
    public function checkContent(Model $model, string $content, ?int $reportedBy = null): Collection
    {
        $keywords = ForbiddenKeyword::active()->get();
        $foundKeywords = collect();
        
        foreach ($keywords as $keyword) {
            // Case-insensitive search for the keyword
            if (stripos($content, $keyword->keyword) !== false) {
                $foundKeywords->push($keyword);
                
                // Create a content flag
                ContentFlag::create([
                    'flaggable_id' => $model->id,
                    'flaggable_type' => get_class($model),
                    'reported_by' => $reportedBy, // Can be null for automatic flagging
                    'reason' => 'Forbidden keyword: ' . $keyword->keyword,
                    'details' => 'Severity level: ' . $keyword->severity,
                    'status' => 'pending',
                ]);
            }
        }
        
        return $foundKeywords;
    }
    
    /**
     * Clean content by replacing forbidden keywords with their replacements or asterisks
     * 
     * @param string $content The content to clean
     * @return string The cleaned content
     */
    public function cleanContent(string $content): string
    {
        $keywords = ForbiddenKeyword::active()->get();
        
        foreach ($keywords as $keyword) {
            $replacement = $keyword->replacement ?? str_repeat('*', strlen($keyword->keyword));
            $content = str_ireplace($keyword->keyword, $replacement, $content);
        }
        
        return $content;
    }
    
    /**
     * Report content manually
     * 
     * @param Model $model The model being reported
     * @param int $reportedBy User ID who is reporting
     * @param string $reason Reason for reporting
     * @param string|null $details Additional details
     * @return ContentFlag
     */
    public function reportContent(Model $model, int $reportedBy, string $reason, ?string $details = null): ContentFlag
    {
        return ContentFlag::create([
            'flaggable_id' => $model->id,
            'flaggable_type' => get_class($model),
            'reported_by' => $reportedBy,
            'reason' => $reason,
            'details' => $details,
            'status' => 'pending',
        ]);
    }
}
