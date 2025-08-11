<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    \Artisan::call('route:cache');
    return 'Console routes loaded';
});