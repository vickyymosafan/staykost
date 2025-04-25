<?php

namespace App\Observers;

use App\Models\Property;
use App\Services\ContentModerationService;

class PropertyObserver
{
    protected $contentModerationService;
    
    /**
     * Create a new observer instance.
     */
    public function __construct(ContentModerationService $contentModerationService)
    {
        $this->contentModerationService = $contentModerationService;
    }
    
    /**
     * Handle the Property "creating" event.
     */
    public function creating(Property $property): void
    {
        // Clean the content if needed
        // $property->description = $this->contentModerationService->cleanContent($property->description);
    }
    
    /**
     * Handle the Property "created" event.
     */
    public function created(Property $property): void
    {
        // Check content for forbidden keywords and flag if found
        $this->checkContentForForbiddenKeywords($property);
    }

    /**
     * Handle the Property "updating" event.
     */
    public function updating(Property $property): void
    {
        // Clean the content if needed
        // $property->description = $this->contentModerationService->cleanContent($property->description);
    }
    
    /**
     * Handle the Property "updated" event.
     */
    public function updated(Property $property): void
    {
        // If the description was updated, check for forbidden keywords
        if ($property->isDirty('description')) {
            $this->checkContentForForbiddenKeywords($property);
        }
    }

    /**
     * Handle the Property "deleted" event.
     */
    public function deleted(Property $property): void
    {
        // No content moderation actions needed on deletion
    }

    /**
     * Handle the Property "restored" event.
     */
    public function restored(Property $property): void
    {
        // Check content again when a property is restored from soft delete
        $this->checkContentForForbiddenKeywords($property);
    }

    /**
     * Handle the Property "force deleted" event.
     */
    public function forceDeleted(Property $property): void
    {
        // No content moderation actions needed on force deletion
    }
    
    /**
     * Helper method to check content for forbidden keywords
     */
    protected function checkContentForForbiddenKeywords(Property $property): void
    {
        // Check the description for forbidden keywords
        $foundKeywords = $this->contentModerationService->checkContent($property, $property->description);
        
        // If high severity keywords found, automatically reject the property
        $hasSevereKeywords = $foundKeywords->contains(function ($keyword) {
            return $keyword->severity === 'high';
        });
        
        if ($hasSevereKeywords) {
            $property->status = 'rejected';
            $property->rejection_reason = 'Automatic rejection: Property description contains inappropriate content';
            $property->rejected_at = now();
            $property->save();
        }
    }
}
