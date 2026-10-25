<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;

class SiteSettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = SiteSetting::query()->firstOrFail();

        return response()->json([
            'brand_name' => $settings->brand_name,
            'brand_name_enabled' => $settings->brand_name_enabled,
            'brand_logo_path' => $settings->brand_logo_path,
            'brand_logo_enabled' => $settings->brand_logo_enabled,
            'announcement_text' => $settings->announcement_text,
            'announcement_enabled' => $settings->announcement_enabled,
        ]);
    }
}
