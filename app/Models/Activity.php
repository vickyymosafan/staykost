<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use App\Models\User;

class Activity extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'description',
        'type',
        'subject_type',
        'subject_id',
        'metadata',
    ];
    
    protected $casts = [
        'metadata' => 'array',
    ];
    
    /**
     * Get the user that performed the activity
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Get the subject of the activity (polymorphic)
     */
    public function subject(): MorphTo
    {
        return $this->morphTo();
    }
    
    /**
     * Log a new activity
     */
    public static function log($userId, $description, $type = null, $subject = null, $metadata = null)
    {
        return self::create([
            'user_id' => $userId,
            'description' => $description,
            'type' => $type,
            'subject_type' => $subject ? get_class($subject) : null,
            'subject_id' => $subject ? $subject->id : null,
            'metadata' => $metadata,
        ]);
    }
}
