<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StoreController;
use App\Http\Controllers\Api\SellerOnboardingController;

Route::get('/user', function (Request $request) {
    return $request->user()->load('roles');
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth:sanctum');

Route::post('/stores', [StoreController::class, 'store'])
    ->middleware('auth:sanctum');
Route::get('/stores', [StoreController::class, 'index'])
    ->middleware('auth:sanctum');
Route::get('/stores/{store}', [StoreController::class, 'show'])
    ->middleware('auth:sanctum');
Route::patch('/stores/{store}', [StoreController::class, 'update'])
    ->middleware('auth:sanctum');
Route::delete('/stores/{store}', [StoreController::class, 'destroy'])
    ->middleware('auth:sanctum');

Route::post('/seller-onboarding', [SellerOnboardingController::class, 'store'])
    ->middleware('auth:sanctum');
