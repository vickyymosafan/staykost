<?php

namespace App\Providers;

use App\Models\Property;
use App\Observers\PropertyObserver;
use App\Providers\ContentModerationServiceProvider;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->register(ContentModerationServiceProvider::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register the PropertyObserver for automatic content moderation
        Property::observe(PropertyObserver::class);
    }
}
