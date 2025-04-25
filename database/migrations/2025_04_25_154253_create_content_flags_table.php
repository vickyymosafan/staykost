<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('content_flags', function (Blueprint $table) {
            $table->id();
            $table->morphs('flaggable'); // For polymorphic relationship (can flag properties, reviews, etc.)
            $table->foreignId('reported_by')->nullable()->constrained('users')->onDelete('set null');
            $table->string('reason');
            $table->text('details')->nullable();
            $table->enum('status', ['pending', 'reviewed', 'rejected', 'actioned'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();
        });
        
        // Create a table for forbidden words/phrases that will trigger automatic flagging
        Schema::create('forbidden_keywords', function (Blueprint $table) {
            $table->id();
            $table->string('keyword');
            $table->string('replacement')->nullable(); // For auto-replacement functionality
            $table->enum('severity', ['low', 'medium', 'high'])->default('medium');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('content_flags');
        Schema::dropIfExists('forbidden_keywords');
    }
};
