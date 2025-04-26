<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Cek apakah kedua tabel ada
        if (Schema::hasTable('facility_property') && Schema::hasTable('property_facility')) {
            // Migrasikan data dari facility_property ke property_facility
            $relations = DB::table('facility_property')->get();
            
            foreach ($relations as $relation) {
                // Cek jika relasi belum ada di property_facility
                $exists = DB::table('property_facility')
                    ->where('property_id', $relation->property_id)
                    ->where('facility_id', $relation->facility_id)
                    ->exists();
                
                if (!$exists) {
                    DB::table('property_facility')->insert([
                        'property_id' => $relation->property_id,
                        'facility_id' => $relation->facility_id,
                        'created_at' => $relation->created_at,
                        'updated_at' => $relation->updated_at,
                    ]);
                }
            }
            
            // Hapus tabel redundan
            Schema::dropIfExists('facility_property');
        }
    }

    /**
     * Reverse the migrations.
     * Catatan: Tidak mungkin untuk memulihkan data yang telah dihapus.
     * Down migration ini hanya menciptakan kembali tabel kosong.
     */
    public function down(): void
    {
        // Jika tabel facility_property sudah dihapus, buat kembali tabel kosong
        if (!Schema::hasTable('facility_property')) {
            Schema::create('facility_property', function (Blueprint $table) {
                $table->foreignId('facility_id')->constrained()->onDelete('cascade');
                $table->foreignId('property_id')->constrained()->onDelete('cascade');
                $table->timestamps();
                $table->primary(['facility_id', 'property_id']);
            });
        }
    }
};
