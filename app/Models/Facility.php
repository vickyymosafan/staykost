<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Category;
use App\Models\Property;

class Facility extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'icon',
        'is_active',
    ];
    
    /**
     * Get the category that owns the facility
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    
    /**
     * Get the properties for the facility
     */
    public function properties()
    {
        return $this->belongsToMany(Property::class);
    }
}
