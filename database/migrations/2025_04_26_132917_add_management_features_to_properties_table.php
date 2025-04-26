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
        Schema::table('properties', function (Blueprint $table) {
            if (!Schema::hasColumn('properties', 'is_featured')) {
                $table->boolean('is_featured')->default(false)->after('status');
            }
            
            if (!Schema::hasColumn('properties', 'has_reported_content')) {
                $table->boolean('has_reported_content')->default(false)->after('is_featured');
            }
            
            // Kolom rejection_reason sudah ada berdasarkan error yang muncul, jadi kita skip

            if (!Schema::hasColumn('properties', 'last_modified_by')) {
                $table->foreignId('last_modified_by')->nullable()->after('rejection_reason')->constrained('users');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            // Hanya drop kolom yang kita tambahkan
            if (Schema::hasColumn('properties', 'last_modified_by')) {
                $table->dropForeign(['last_modified_by']);
                $table->dropColumn('last_modified_by');
            }
            
            if (Schema::hasColumn('properties', 'has_reported_content')) {
                $table->dropColumn('has_reported_content');
            }
            
            if (Schema::hasColumn('properties', 'is_featured')) {
                $table->dropColumn('is_featured');
            }
            
            // Kita tidak drop rejection_reason karena sudah ada sebelumnya
        });
    }
};
