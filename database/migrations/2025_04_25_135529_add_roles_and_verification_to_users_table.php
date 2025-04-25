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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'owner', 'user'])->default('user')->after('email');
            $table->enum('verification_status', ['unverified', 'pending', 'verified'])->default('unverified')->after('password');
            $table->string('id_card_path')->nullable()->after('verification_status');
            $table->text('verification_notes')->nullable()->after('id_card_path');
            $table->json('permissions')->nullable()->after('verification_notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'verification_status',
                'id_card_path',
                'verification_notes',
                'permissions'
            ]);
        });
    }
};
