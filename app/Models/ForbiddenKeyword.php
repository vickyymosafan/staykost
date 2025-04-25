<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ForbiddenKeyword extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'keyword',
        'replacement',
        'severity',
        'is_active',
    ];
    
    protected $casts = [
        'is_active' => 'boolean',
    ];
    
    /**
     * Scope a query to only include active keywords
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
