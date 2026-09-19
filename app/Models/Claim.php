<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Claim extends Model
{
    use HasFactory;

    protected $fillable = [
        'claim_number',
        'full_name',
        'document_type',
        'document_number',
        'phone',
        'email',
        'address',
        'contracted_type',
        'amount',
        'claim_type',
        'detail',
        'status',
        'response_notes'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];
}
