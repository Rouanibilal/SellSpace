<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    protected $fillable = [
        'brand_name',
        'brand_name_enabled',
        'brand_logo_path',
        'brand_logo_enabled',
        'announcement_text',
        'announcement_enabled',
    ];

    protected function casts(): array
    {
        return [
            'brand_name_enabled' => 'boolean',
            'brand_logo_enabled' => 'boolean',
            'announcement_enabled' => 'boolean',
        ];
    }
}
