<?php

namespace App\Providers;

use App\Services\ContentModerationService;
use Illuminate\Support\ServiceProvider;

class ContentModerationServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(ContentModerationService::class, function ($app) {
            return new ContentModerationService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
