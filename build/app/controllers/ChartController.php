<?php

class ChartController extends \BaseController {

	/**
	 * Display a listing of the resource.
	 *
	 * @return Response
	 */
	public function index()
	{
		$message = array("Message" => "Nothing Here.");

		return Response::json($message);
	}


	/**
	 * Show the form for creating a new resource.
	 *
	 * @return Response
	 */
	public function create()
	{
		//
	}

	/**
	 * Store a newly created resource in storage.
	 *
	 * @return Response
	 */
	public function store()
	{
		
		//TODO: Use a loop and map?

		$board = Input::get('board');
		$fromDate = Input::get('fromDate');
		$toDate = Input::get('toDate');
		$duration = Input::get('duration');
		$data = Input::get('data');


		$chart = Chart::create(array(
			'board' => $board,
			'fromDate' => (string) $fromDate,
			'toDate' => (string) $toDate,
			'duration' => (int) $duration,
			'data' => $data,

		));


		return Response::json($chart->id);

	}


	/**
	 * Display the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		$chart = Chart::find($id);
		return $chart;
	}


	/**
	 * Show the form for editing the specified resource.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}


	/**
	 * Update the specified resource in storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}


	/**
	 * Remove the specified resource from storage.
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}


}
