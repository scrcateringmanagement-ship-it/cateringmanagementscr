<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Tymon\JWTAuth\Contracts\JWTSubject; // ? Add this

class Licensee extends Authenticatable implements JWTSubject // ? Implement this
{
    use HasFactory, Notifiable;

    protected $table = 'licensees';

    protected $fillable = [
        'Licensee_firm_name',
        'Licensee_name',
        'mobile',
        'pan',
        'type',
        'status',
        'zone',
        'division',
    ];

    // ? Required by JWT
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
