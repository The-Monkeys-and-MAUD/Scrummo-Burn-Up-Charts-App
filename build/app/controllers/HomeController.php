<?php

class HomeController extends BaseController {

	/*
	|--------------------------------------------------------------------------
	| Default Home Controller
	|--------------------------------------------------------------------------
	|
	| You may wish to use controllers instead of, or in addition to, Closure
	| based routes. That's great! Here is an example controller method to
	| get you started. To route to this controller, just add the route:
	|
	|	Route::get('/', 'HomeController@showWelcome');
	|
	*/

	public function index()
	{

		// session_start();

		// $sesh = $_SESSION['oauth_token_secret'];

		// dd($sesh);


		// $key = Config::get('trello.api_key');
		// $secret = Config::get('trello.api_secret');
		// $trello = new \Trello\Trello($key, $secret);

		// $trello->authorize(array(
		// 	'expiration' => '1hour',
		// 	'scope' => array(
		// 	    'read' => true,
		// 	),
		// 	'name' => Config::get('trello.app_name'),
		// 	'success' => 'onAuthorizeSuccessful'
		// ));

		//  function onAuthorizeSuccessful() {
		// 	dd("die!");
		// }
		

		// $boards = $trello->members->get('my/boards');

		// return View::make('index', array(
		// 	'boards' => $boards,
		// ));

		return View::make('index');
	}

}
