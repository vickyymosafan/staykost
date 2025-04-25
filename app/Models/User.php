<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'verification_status',
        'id_card_path',
        'verification_notes',
        'permissions',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'permissions' => 'json',
        ];
    }
    
    /**
     * Check if user has admin role
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
    
    /**
     * Check if user has owner role
     *
     * @return bool
     */
    public function isOwner(): bool
    {
        return $this->role === 'owner';
    }
    
    /**
     * Check if user has regular user role
     *
     * @return bool
     */
    public function isUser(): bool
    {
        return $this->role === 'user';
    }
    
    /**
     * Check if user has specific permission
     *
     * @param string $permission
     * @return bool
     */
    public function hasPermission(string $permission): bool
    {
        if ($this->isAdmin()) {
            return true; // Admin has all permissions
        }
        
        $userPermissions = json_decode($this->permissions, true) ?? [];
        return in_array($permission, $userPermissions);
    }
    
    /**
     * Check if user is verified
     *
     * @return bool
     */
    public function isVerified(): bool
    {
        return $this->verification_status === 'verified';
    }
}
