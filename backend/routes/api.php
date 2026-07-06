<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminAspirationController;
use App\Http\Controllers\Api\AspirationCategoryController;
use App\Http\Controllers\Api\MyAspirationController;
use App\Http\Controllers\Api\RegionController;
use App\Http\Controllers\Api\SvmTrainingDataController;
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
    Route::apiResource('my-aspirations', MyAspirationController::class)
        ->only(['index', 'store', 'show'])
        ->parameters(['my-aspirations' => 'myAspiration']);

    Route::prefix('admin')->group(function (): void {
        Route::get('/aspirations', [AdminAspirationController::class, 'index']);
        Route::get('/aspirations/{aspiration}', [AdminAspirationController::class, 'show']);
        Route::put('/aspirations/{aspiration}/verify', [AdminAspirationController::class, 'verify']);
        Route::put('/aspirations/{aspiration}/reject', [AdminAspirationController::class, 'reject']);
        Route::put('/aspirations/{aspiration}/status', [AdminAspirationController::class, 'updateStatus']);
        Route::post('/aspirations/{aspiration}/responses', [AdminAspirationController::class, 'storeResponse']);
        Route::post('/aspirations/{aspiration}/predict-priority', [AdminAspirationController::class, 'predictPriority']);
        Route::apiResource('svm-training-data', SvmTrainingDataController::class)
            ->parameters(['svm-training-data' => 'svmTrainingDatum']);
    });
});
