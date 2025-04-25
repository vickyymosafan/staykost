<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Property;
use App\Models\Facility;

class Category extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'slug',
        'type',
        'description',
        'is_active',
    ];
    
    /**
     * Get the properties that belong to this category
     */
    public function properties()
    {
        return $this->hasMany(Property::class);
    }
    
    /**
     * Get the facilities that belong to this category
     */
    public function facilities()
    {
        return $this->hasMany(Facility::class);
    }
}
