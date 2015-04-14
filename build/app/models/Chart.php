<?php



class Chart extends UuidModel
{

	protected $guarded = array();

	//TODO: Put validation!
    protected $fillable = [
    	'board',
    	'fromDate',
    	'toDate',
    	'duration',
    	'data'
    ];

}
