<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();

            $table->string('brand_name');
            $table->boolean('brand_name_enabled')->default(true);

            $table->string('brand_logo_path')->nullable();
            $table->boolean('brand_logo_enabled')->default(false);

            $table->text('announcement_text');
            $table->boolean('announcement_enabled')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
