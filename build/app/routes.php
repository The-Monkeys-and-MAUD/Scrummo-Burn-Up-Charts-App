<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/


// Home page
Route::get('/', 'HomeController@index');
Route::get('/c/{id}', 'HomeController@index');

//Route::get('/chart/', 'ChartController@get');


Route::resource('chart', 'ChartController');



// Route::get('/save', function(){
// 	return "Nothing to see here :)";
// });


// Route::post('/save', 'SaveController@save');


// These routes will be cached, if you configure a non-zero bladeCacheExpiry.
// Full documentation at https://github.com/TheMonkeys/laravel-blade-cache-filter
Route::group(array('before' => 'cache', 'after' => 'cache'), function() {

	Route::get('/css/{filename}.css', function($filename) {
		return Bust::css("/css/$filename.css");
	});

});
App::make('cachebuster.StripSessionCookiesFilter')->addPattern('|css/|');
