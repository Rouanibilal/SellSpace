<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SellerOnboardingController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->hasRole('seller')) {
            return response()->json([
                'message' => 'You are already a seller.',
                'user' => $user->load('roles'),
            ]);
        }

        if (! $user->hasRole('customer')) {
            return response()->json([
                'message' => 'Only customers can become sellers.',
            ], 403);
        }

        $sellerRole = Role::where('slug', 'seller')->firstOrFail();

        DB::transaction(function () use ($user, $sellerRole) {
            $user->roles()->syncWithoutDetaching([$sellerRole->id]);
        });

        return response()->json([
            'message' => 'You are now registered as a seller.',
            'user' => $user->load('roles'),
        ]);
    }
}
