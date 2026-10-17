<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electronics',
                'slug' => 'electronics',
                'description' => 'Electronic devices and accessories.',
            ],
            [
                'name' => 'Fashion & Accessories',
                'slug' => 'fashion-accessories',
                'description' => 'Clothing, shoes, and accessories.',
            ],
            [
                'name' => 'Home & Living',
                'slug' => 'home-living',
                'description' => 'Furniture, home goods, and decor.',
            ],
            [
                'name' => 'Sports & Outdoors',
                'slug' => 'sports-outdoors',
                'description' => 'Sports equipment and outdoor products.',
            ],
            [
                'name' => 'Books & Media',
                'slug' => 'books-media',
                'description' => 'Books and other media products.',
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                [
                    ...$category,
                    'parent_id' => null,
                ],
            );
        }
    }
}
