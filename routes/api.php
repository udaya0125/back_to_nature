<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TrekkingController;
use App\Http\Controllers\TourController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Trekking slug
Route::get('/ourtrekking/{slug}', [TrekkingController::class, 'indexShowTrekkingSlug']);

// Trekking 
Route::get('/ourtrekking', [TrekkingController::class, 'index']);

// Tour Slug
Route::get('/ourtour/{slug}', [TourController::class, 'indexShowTourSlug']);

// Hiking slug
Route::get('/ourhiking/{slug}', [TrekkingController::class, 'indexShowHikingSlug']);

// Hiking
Route::get('/ourhiking', [TourController::class, 'index']);

// Tour
Route::get('/ourtour', [TourController::class, 'index']);

// Category
Route::get('/category', [CategoryController::class, 'index']); 

//Sub Category
Route::get('/subcategory', [SubCategoryController::class, 'index']);