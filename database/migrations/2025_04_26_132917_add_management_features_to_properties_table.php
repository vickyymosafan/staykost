<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Menambahkan fitur manajemen tambahan ke tabel properties.
     */
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->boolean('is_featured')->default(false)->after('status');
            $table->boolean('has_reported_content')->default(false)->after('is_featured');
            $table->foreignId('last_modified_by')->nullable()->after('rejection_reason')->constrained('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropForeign(['last_modified_by']);
            $table->dropColumn([
                'is_featured',
                'has_reported_content',
                'last_modified_by'
            ]);
        });
    }
};
