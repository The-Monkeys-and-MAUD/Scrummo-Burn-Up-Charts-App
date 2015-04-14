<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBoardsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('charts', function($table)
		{
		    $table->string('id');
		    $table->primary('id');

		    $table->string('board');
		    $table->string('fromDate', 100);
		    $table->string('toDate', 100);
		    $table->tinyInteger('duration');
		    $table->text('data');

		    $table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('charts');
	}

}
