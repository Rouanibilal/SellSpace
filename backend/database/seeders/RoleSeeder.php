<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        Role::updateOrCreate(
            ['slug' => 'customer'],
            [
                'name' => 'Customer',
                'description' => 'A user who purchases products.',
            ]
        );

        Role::updateOrCreate(
            ['slug' => 'seller'],
            [
                'name' => 'Seller',
                'description' => 'A user who manages a store and sells products.',
            ]
        );

        Role::updateOrCreate(
            ['slug' => 'admin'],
            [
                'name' => 'Admin',
                'description' => 'An administrator who manages the marketplace.',
            ]
        );
    }
}
