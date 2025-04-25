<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\User;

class ContentFlag extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'flaggable_id',
        'flaggable_type',
        'reported_by',
        'reason',
        'details',
        'status',
        'admin_notes',
        'reviewed_by',
        'reviewed_at',
    ];
    
    protected $casts = [
        'reviewed_at' => 'datetime',
    ];
    
    /**
     * Get the flaggable model (property, review, etc.)
     */
    public function flaggable()
    {
        return $this->morphTo();
    }
    
    /**
     * Get the user who reported this content
     */
    public function reporter()
    {
        return $this->belongsTo(User::class, 'reported_by');
    }
    
    /**
     * Get the admin who reviewed this flag
     */
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
    
    /**
     * Scope a query to only include pending flags
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}
