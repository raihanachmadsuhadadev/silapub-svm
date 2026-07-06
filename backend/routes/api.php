<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AspirationCategoryController;
use App\Http\Controllers\Api\RegionController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function (): void {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

Route::middleware('auth:sanctum')->group(function (): void {
    Route::apiResource('aspiration-categories', AspirationCategoryController::class)
        ->parameters(['aspiration-categories' => 'aspirationCategory']);
    Route::apiResource('regions', RegionController::class);
});
