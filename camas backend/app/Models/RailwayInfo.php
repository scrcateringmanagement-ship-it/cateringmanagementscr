<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RailwayInfo extends Model
{
    use HasFactory;
    protected $fillable = ['zone', 'division', 'section','station','station_category']; 
}
