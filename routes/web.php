<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TourController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\TrekkingController;
use App\Http\Controllers\ActivityLogsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\HikingController;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // Routes For the Tours 
    Route::get("/tour",function(){
        return Inertia::render("AdminPage/Tour");
    });

    Route::get("/category",function(){
        return Inertia::render("AdminPage/Category");
    });

    Route::get("/sub-category",function(){
        return Inertia::render("AdminPage/SubCategory");
    });


    Route::get('/ourtour', [TourController::class, 'index'])->name('ourtour.index');      
    Route::post('/ourtour', [TourController::class, 'store'])->name('ourtour.store');     
    Route::put('/ourtour/{id}', [TourController::class, 'update'])->name('ourtour.update'); 
    Route::delete('/ourtour/{id}', [TourController::class, 'destroy'])->name('ourtour.destroy');


    Route::get('/ourcategory', [CategoryController::class, 'index'])->name('ourcategory.index');      
    Route::post('/ourcategory', [CategoryController::class, 'store'])->name('ourcategory.store');     
    Route::put('/ourcategory/{id}', [CategoryController::class, 'update'])->name('ourcategory.update'); 
    Route::delete('/ourcategory/{id}', [CategoryController::class, 'destroy'])->name('ourcategory.destroy');

    Route::get('/subcategory', [SubCategoryController::class, 'index'])->name('subcategory.index');      
    Route::post('/subcategory', [SubCategoryController::class, 'store'])->name('subcategory.store');     
    Route::put('/subcategory/{id}', [SubCategoryController::class, 'update'])->name('subcategory.update'); 
    Route::delete('/subcategory/{id}', [SubCategoryController::class, 'destroy'])->name('subcategory.destroy');

     Route::get('categorywithsubcategory',[CategoryController::class,'indexWithSubCategory'])->name('categorywithsubcategory.indexWithSubCategory');

    // 

     Route::get("/hiking",function(){
        return Inertia::render("AdminPage/Hiking");
    });

    Route::get('/ourhiking', [HikingController::class, 'index'])->name('ourhiking.index');      
    Route::post('/ourhiking', [HikingController::class, 'store'])->name('ourhiking.store');     
    Route::put('/ourhiking/{id}', [HikingController::class, 'update'])->name('ourhiking.update'); 
    Route::delete('/ourhiking/{id}', [HikingController::class, 'destroy'])->name('ourhiking.destroy');

    //
     Route::get("/trekking",function(){
        return Inertia::render("AdminPage/Trekking");
    });


    // Route::get("/trekking/categories",function(){
    //     return Inertia::render("AdminPage/TrekkingCategory");
    // });

    // Route::get("/trekking/sub_category",function(){
    //     return Inertia::render("AdminPage/TrekkingSubCategory");

    // });

    Route::get('/ourtrekking', [TrekkingController::class, 'index'])->name('ourtrekking.index');      
    Route::post('/ourtrekking', [TrekkingController::class, 'store'])->name('ourtrekking.store');     
    Route::put('/ourtrekking/{id}', [TrekkingController::class, 'update'])->name('ourtrekking.update'); 
    Route::delete('/ourtrekking/{id}', [TrekkingController::class, 'destroy'])->name('ourtrekking.destroy');

    //
     Route::get("/dashboard",function(){
        return Inertia::render("AdminPage/Home");
    });

 //
     Route::get("/activity-logs",function(){
        return Inertia::render("AdminPage/Logs");
    });

    Route::get('/ourlogs', [ActivityLogsController::class, 'index'])->name('ourlogs.index');  


    //
     Route::get("/user-management",function(){
        return Inertia::render("AdminPage/UserManagement");
    });

    Route::get('/ouruser', [UserController::class, 'index'])->name('ouruser.index');      
    Route::post('/ouruser', [UserController::class, 'store'])->name('ouruser.store');     
    Route::put('/ouruser/{id}', [UserController::class, 'update'])->name('ouruser.update'); 
    Route::delete('/ouruser/{id}', [UserController::class, 'destroy'])->name('ouruser.destroy');
    
});



    Route::get("/trekkingpage",function(){
        return Inertia::render("HomePage/TrekkingPage");
    });



    Route::get("/tourpage",function(){
        return Inertia::render("HomePage/TourPage");
    });

    Route::get("/hikingpage",function(){
        return Inertia::render("HomePage/HikingPage");
    });

    Route::get("/",function(){
        return Inertia::render("HomePage/Welcome");
    });


 

require __DIR__.'/auth.php';
