<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $table = 'accounts';
    protected $primaryKey = 'AccountID';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'AccountID',
        'AName',
        'Email',
        'Pass',     // ⚡ thêm để tránh lỗi MassAssignment
        'ARole',
        'AStatus'
    ];
}
