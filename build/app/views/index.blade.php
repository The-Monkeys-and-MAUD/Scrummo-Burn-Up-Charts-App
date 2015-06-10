@extends('layouts.common')

@section('title')
	Scrummo
@stop

@section('body-class')

   
@stop

@section('body')
        
       

       <div id="main">

            <div class="ribbon">
                <a href="https://chrome.google.com/webstore/detail/scrummo/blocgblopglhhmdeeafpljaameimgega" target="_blank">Get the Chrome Extension</a>
            </div>

            <h1>Scrummo</h1>

            <div id="initial">

                {{-- Login / Auth --}}
                <div class="content" id="login">
            		<button id="connect" class="fa-unlock-alt btn btn-inverse">Authorize Trello</button>           
            	</div>

                {{-- User form view --}}
            	<div class="content" id="form">
                    <select name="boards" id="boards">
                        <option value="-1">Choose a board</option>
                    </select>

                    <span class="dates start">
                        <input type="text" class="datepicker" id="fromDate" placeholder="Start Date" required>
                        <span></span>
                    </span><!--
                    --><span class="dates end">
                        <input type="text" class="datepicker" id="toDate" placeholder="End Date" required>
                        <span></span>
                    </span><!--
                    --><select class="short" name="duration" id="duration">
                        <option value="-1">Sprint duration</option>
                        <option value="1">1 day</option>
                        <option value="7">1 week (7 days)</option>
                        <option value="14">2 weeks (14 days)</option>
                        <option value="28">3 weeks (28 days)</option>
                        <option value="35">4 weeks (35 days)</option>
                        <option value="42">5 weeks (42 days)</option>
                        <option value="49">6 weeks (49 days)</option>
                    </select>

                    <button id="generate" type="button" class="fa-line-chart btn">Make the chart!</button>
                    

                    <span id="note"><b>The sprint duration specified, is longer than the date range given.</b><br> Will default to daily sprints instead!</span>

            	</div>

                {{-- No Auth: Existing chart loaded! --}}
                <div class="content" id="existing">
                    <button id="generate-new" type="button" class="fa-line-chart btn">Make a new chart</button>
                </div>
            </div>
            
            <div id="loading">
                <p id="loadingMessage">Reading Cards: <span id="cardsRemaining"></span> / <span id="cardsTotal"></span></p>
            </div>

            {{-- Results & Data View --}}

            <div class="content" id="results">
                <div id="graph">{{-- HighCharts --}}</div>
                <div id="velocityAverage">{{-- HighCharts --}}</div>
                <div id="tableData">{{-- Table Data --}}</div>
            </div>

            <div class="content intro info" data-info="intro">
                <h3>How To Use Scrummo</h3>
                <div class="details">
                    <ol>
                    <li>During your usual agile estimations, use the <a href="http://google.com">Scrummo Chrome Extension</a> to put points on your Trello Cards.</li>
                    <li>Use the "DONE" button on the card, to mark a card as done.</li>
                    <li>In Scrummo.io: Authorize Trello, Choose a Trello Board, Specify the start date, end date and sprint duration, and generate your burn up chart.</li>
                    <li>You will then get a unique URL in the address bar, which you can share with the team.</li>
                    </ol>
                </div>
                <span class="hide"></span>
            </div>

            <div class="content resources info" data-info="resources">
                <h3>Resources</h3>
                <div class="details">
                    <h4>For questions &amp; issues related to Scrummo Burn Up Charts</h4>
                    <a href="https://github.com/TheMonkeys/Scrummo-Burn-Up-Charts-App/" target="_blank">https://github.com/TheMonkeys/Scrummo-Burn-Up-Charts-App/</a>
                    <h4>For questions &amp; issues related to Scrummo Chrome Extension</h4>
                    <a href="https://github.com/TheMonkeys/Scrummo-Browser-Plugin" target="_blank">https://github.com/TheMonkeys/Scrummo-Browser-Plugin</a>
                    <h4>To request a feature</h4>
                    <a href="https://trello.com/b/dG67P1gb/3dm1528-scrummo" target="_blank">https://trello.com/b/dG67P1gb/3dm1528-scrummo</a>
                </div> 
                <span class="hide"></span>
            </div>

            <div class="footer">
                <a href="http://themonkeys.com.au" class="logo"></a>
                Scrummo is created and maintained by <a href="http://themonkeys.com.au" target="_blank">The Monkeys</a>.
            </div>

        </div>
		

@stop

