<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SiteSettingsSeeder extends Seeder
{
    public function run(): void
    {
        if (DB::table('site_settings')->exists()) {
            return;
        }

        DB::table('site_settings')->insert([
            'brand_name' => 'SellSpace',
            'brand_name_enabled' => true,
            'brand_logo_path' => null,
            'brand_logo_enabled' => false,
            'announcement_text' => 'Discover independent stores. Find something you love.',
            'announcement_enabled' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
