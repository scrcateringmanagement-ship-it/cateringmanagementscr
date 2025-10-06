<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject; //  ADD THIS


class User extends Authenticatable implements JWTSubject //  IMPLEMENT JWTSubject
{
    use Notifiable;

    protected $fillable = [
        'name',
        'desig',
        'mobile',
        'loginid',
        'password',
        'type',
        'role',
        'userapp',
        'zone',
        'division',
        'firebase_key',
        'location',
    ];

    protected $hidden = [
        'password',
        'remember_token',
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
