<?php

use Illuminate\Support\Facades\Route;

// Placeholder for auth routes
Route::post('/login', function () {
    return response()->json(['message' => 'Login endpoint - to be implemented']);
});

Route::post('/register', function () {
    return response()->json(['message' => 'Register endpoint - to be implemented']);
});

Route::post('/logout', function () {
    return response()->json(['message' => 'Logout endpoint - to be implemented']);
});