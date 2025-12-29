<?php

use App\Http\Controllers\ArticleController;
use Illuminate\Support\Facades\Route;

// Ab ye automatically /api prefix ke saath chalega
Route::get('/articles', [ArticleController::class, 'index']);
Route::post('/articles', [ArticleController::class, 'store']);
