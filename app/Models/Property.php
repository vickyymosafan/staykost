<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Property extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $fillable = [
        'user_id',
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'deposit_amount',
        'address',
        'city',
        'state',
        'zip_code',
        'latitude',
        'longitude',
        'capacity',
        'is_available',
        'status',
        'rejection_reason',
        'approved_at',
        'rejected_at',
    ];
    
    protected $casts = [
        'price' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'is_available' => 'boolean',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];
    
    /**
     * Get the user that owns the property
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    /**
     * Get the category that owns the property
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    
    /**
     * Get the facilities for the property
     */
    public function facilities()
    {
        return $this->belongsToMany(Facility::class);
    }
    
    /**
     * Get the content flags for the property
     */
    public function contentFlags()
    {
        return $this->morphMany(ContentFlag::class, 'flaggable');
    }
    
    /**
     * Scope a query to only include pending properties
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
    
    /**
     * Scope a query to only include approved properties
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }
    
    /**
     * Scope a query to only include rejected properties
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }
}
