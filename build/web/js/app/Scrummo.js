define(['jquery', 'lodash', 'moment', 'twix', 'highcharts', 'app/Charts', 'app/Dates'], function ($, _, moment, twix, highcharts, Charts, Dates) {
    'use strict';

    // ------------------------
    // Constants
    // ------------------------

    var el = {
        connectButton: $("#connect"),
        login: $("#login"),
        loading: $("#loading"),
        theForm: $("#form"),
        boardSelect: $("#boards"),
        durationSelect: $("#duration"),
        submitButton: $("#generate"),
        newChartButton: $("#generate-new"),
        boardsList: $("#boards"),
        results: $("#results"),
        existing: $("#existing"),
        note: $("#note"),
        tableData: $("#tableData"),
        graph: $("#graph"),
        datesTableID: "#datesTable",
        hideButton: $(".hide"),
        info: $(".info"),
        loadingMessage: $("#loadingMessage"),
        cardsRemaining: $("#cardsRemaining"),
        cardsTotal: $("#cardsTotal")
    };

    var o = {
        loginToken: 'trello_token',
        boardName: null,
        boardID: null,
        messageNone: "No comments found for this board. Please choose another and try again.",
        messageScrummo: "No Scrummo comments found. Please use the browser plugin to estimate cards, which will create data, that this application can read.",
        messageDiffDuration: "<b>The sprint duration specified, is longer than the date range given.</b><br> Will default to daily sprints instead!",
        cardData: [],
        allCards: [],
        doneValue: 'DONE',
        ignoreValue: 'IGNORE',
        fromDate: null,
        toDate: null,
        existingData: false,
        doneSoFar: 0,
        estimatedSoFar: 0,
        duration: null,
        cardFetchInterval:null,
        skipSave: false //Only set to true if page is loaded with an existing URL!
    };

    // -----------------------
    // Class Constructor
    // ------------------------

    var Scrummo = {

        // ------------------------
        // Methods
        // ------------------------
        init: function () {

            //Load Trello API
            var r = false,
                js = document.createElement("script");

            js.type = "text/javascript";
            js.src = "https://api.trello.com/1/client.js?key=319fd22c0406c7f542c72afc8c660923";
            document.body.appendChild(js);

            var _this = this;

            //Once Trello is loaded, proceed.
            js.onload = js.onreadystatechange = function () {

                if (!r && (!this.readyState || this.readyState === 'complete')) {
                    r = true;
                    _this.checkForSavedChart();
                    _this.addEvents();
                }
            };

            //Check if user has opted to hide the intro to Scrummo copy.
            el.hideButton.on("click", {}, $.proxy(this.onToggleClick, this));
            this.checkForCollapsedInfoPanels();

        },


        /*
             Check local storage, to see if user has chosen to "hide" the intro to scrummo.
        **/
        checkForCollapsedInfoPanels: function () {
            var infoPanels = ['intro', 'resources'];
            for (var x = 0; x < infoPanels.length; x++) {
                if (localStorage.getItem('hide_' + infoPanels[x]) !== null) {
                    $("." + infoPanels[x]).find("span.hide").trigger("click");
                }
            }
        },

        /*
             Check local storage for token
        **/
        checkForLoginToken: function () {

            var url = location.href;
            var is_auth = (localStorage.getItem(o.loginToken) !== null || url.indexOf("#token=") !== -1);

            if (is_auth) {
                this.onAuthenticateTrello(true);
            } else {
                el.login.show();
            }
        },

        /*
             Check URL, and if we should fetch an existing chart
        **/
        checkForSavedChart: function () {
            var url = location.href;

            if (url.indexOf("/c/") !== -1) {
                var id = url.split("/c/");
                id = id[1];
                console.info("We have a chart to try and load!");
                //We have a chart to work with!

                el.loading.show();

                this.loadExistingChart(id);
            } else {
                //No chart, check for token etc.
                this.checkForLoginToken();
            }

        },

        /*
             Fetch an existing chart's data
             @id | string | the id (udid) of the chart to fetch from storage
        **/
        loadExistingChart: function (id) {
            var _this = this;

            //Perform ajax request and oncomplete function
            this.getChartData(id).done(function (data) {
                _this.parseExistingChart(data);
            }).fail(function () {
                //Invalid ID in URL, go back to home
                _this.checkForLoginToken();
            });

        },

        /*
             Perform the AJAX request
             @id | string | the id to search the DB for
        **/
        getChartData: function (id) {
            var ajaxGet = $.ajax({
                type: "GET",
                url: '/chart/' + id,
                dataType: 'json'
            });

            return ajaxGet;

        },


        /*
             Parse an existing object and create a chart!
             @data | object | data object from DB, in the same format the chart generation depends on!
        **/

        parseExistingChart: function (data) {

            o.skipSave = true;
            el.existing.show();

            //Set globals
            o.fromDate = data.fromDate;
            o.toDate = data.toDate;
            o.duration = data.duration;
            o.allCards = JSON.parse(data.data);
            o.boardName = data.board;

            this.sortGroupAndDisplayDates();

        },


        /*
             Event bindings
        **/
        addEvents: function () {
            el.connectButton.on("click", {}, $.proxy(this.onAuthenticateTrello, this));
            el.submitButton.on("click", {}, $.proxy(this.onRequestCards, this));

            el.newChartButton.on("click", {}, function () {
                location.href = "/";
            });

            $(document).on("click", "#datesTable tr", {}, function () {
                var list = $(this).find("ul");
                if ($(this).find("ul li").length > 0) {
                    list.toggle();
                    list.next("span").toggleClass("open");
                }
            });
        },

        /*
             Hides a given info module
             @e | DOM Event
        **/

        onToggleClick: function (e) {
            var infoPanel = $(e.target).parent();

            $(e.target).toggleClass("open").parent().toggleClass("open").find(".details").toggle();

            if (infoPanel.hasClass("open")) {
                localStorage.setItem("hide_" + infoPanel.data("info"), true);
            } else {
                localStorage.removeItem("hide_" + infoPanel.data("info"));
            }

        },


        /*
             Uses client.js to authenticate Trello
             @skipAuthToken | string | Tells class to skip manual token fetching, if one exists.
        **/
        onAuthenticateTrello: function (skipAuthToken) {

            el.connectButton.attr("disabled", "disabled");
            var _t = this;

            el.loading.show();
            var hasToken = (skipAuthToken) ? true : false;

            window.Trello.authorize({
                name: "Scrummo",
                type: "redirect",
                interactive: hasToken,
                expiration: "30days",
                persist: true,
                success: function () {
                    el.loading.hide();
                    _t.onAuthorizeSuccessful();
                },
                error: function () {
                    _t.onFailedAuthorization();
                },
                scope: {
                    read: true
                },
            });
        },

        /*
            Success callback from Trello OAuth
        **/

        onAuthorizeSuccessful: function () {
            el.connectButton.removeAttr("disabled", "disabled");
            el.login.hide();
            el.loading.show();
            this.getTrelloBoards();
        },

        /*
            Failure callback from Trello OAuth
        **/
        onFailedAuthorization: function () {

        },

        /*  
            Event handler to request cards from API
             @e: DOM Event
        **/
        onRequestCards: function (e) {

            e.preventDefault();

            var selected = $("#boards option:selected"),
                fromDate = $("#fromDate").val(),
                toDate = $("#toDate").val(),
                duration = $("#duration option:selected");

            //if (selected.val() !== '-1') {
            if (selected.val() !== '-1' && fromDate !== "" && toDate && duration !== "") {

                //Clear existing, if so
                if (o.existingData) {
                    this.resetDataAndDisplay();
                }
                o.existingData = true;

                el.loading.show();
                el.submitButton.attr("disabled", "disabled");


                var formattedStart = new Date(fromDate),
                    formattedEnd = new Date(toDate);


                //Store!
                o.boardName = selected.text();
                o.boardID = selected.val();
                o.duration = duration.val();
                o.fromDate = moment(formattedStart).format("DD-MM-YYYY");
                o.toDate = moment(formattedEnd).format("DD-MM-YYYY");

                //Get some comments!
                this.getTrelloCards(o.boardID);

            } else {
                window.alert("Please choose a board and the start / end dates");
            }

        },


        /*
             Returns all boards
        **/
        getTrelloBoards: function () {
            window.Trello.get("members/me?boards=open", this.onTrelloBoardsOK, this.onTrelloTokenError);
        },

        /*
             Success callback for getting all boards
             @board | object | Object returned from Trello API
        **/
        onTrelloBoardsOK: function (board) {

            el.theForm.show();
            el.loading.hide();

            $.each(board.boards, function (ix, board) {
                $("<option>")
                    .text(board.name)
                    .val(board.id)
                    .appendTo("#boards");
            });

            //See app/Dates.js
            Dates.init();
        },

        /*
             Error callback for bad tokens
        **/
        onTrelloTokenError: function () {
            window.alert("An error has occured with your Authorization. Please try again!");
            if (localStorage.getItem(o.loginToken)) {
                localStorage.removeItem(o.loginToken);
                location.href = "/";
            }
        },

        /* 
            Returns all cards within a board
            @ID | string | Board ID
        **/
        getTrelloCards: function (id) {

            var _this = this;
            var cardData = []; //Clear

            window.Trello.get("boards/" + id + "/cards", function (card) {
                $.each(card, function (ix, card) {
                    cardData.push({
                        id: card.id,
                        name: card.name
                    });
                });
                //On Success, get comments
                
                _this.getTrelloCardComments(cardData);


            });
        },


        /*
            Returns all comments from a card
            @id | string | Card Id
            @cardObj | object | Card Object
        **/
        getTrelloCardComments: function (cardData) {

            var cards = cardData,
                _this = this,
                cardComments = {},
                loopCount = 0;

            if (cards && cards.length > 1) {


                 el.loadingMessage.fadeIn();
                 el.cardsRemaining.empty();
                 el.cardsTotal.html(cards.length);

                    $.each(cards, function (i) {
                        var id = cards[i].id;

                        cardComments[id] = {
                            id: id,
                            name: cards[i].name,
                            comments: {}
                        };  

                        clearInterval(o.cardFetchInterval);

                        o.cardFetchInterval = setInterval(function() {

                            window.Trello.get("cards/" + id + "/actions?filter=commentCard", function (comment) {

                                loopCount++;

                                //Do we even have comments?
                                if (comment.length > 0) {
                                    for (var b = 0; b < comment.length; b++) {

                                        //Do the comments match our Scummo schema?
                                        if (comment[b].data.text.indexOf("[[") !== -1 && comment[b].data.text.indexOf("]]") !== -1) {

                                            el.cardsRemaining.html(loopCount);

                                            //Store comment data in an object literal
                                            cardComments[id]['comments'][comment[b].id] = {
                                                commentText: _this.cleanComment(comment[b].data.text),
                                                commentDate: comment[b].date
                                            };
                                        } else {}
                                    }
                                } else {
                                    // el.loading.hide();
                                }

                                //Check if all our calls are complete, then do something with the data...
                                if (loopCount === cards.length) {
                                    el.loadingMessage.hide();
                                    _this.parseAndStoreCardData(cardComments);
                                }

                            });

                        }, 250);

                    });
        






            }


        },

        /*
            Parses the comments in all cards, and logically stores them in an object.
            NOTE: Will first ignore cards which are marked with an ignore value.
            @cardComments | object | Trello comment data
        **/
        parseAndStoreCardData: function (cardComments) {

            el.submitButton.removeAttr("disabled", "disabled");

            clearInterval(o.cardFetchInterval);

            var cards = cardComments;
            for (var key in cards) {
                if (cards.hasOwnProperty(key)) {

                    var card = cards[key],
                        comments = card['comments'],
                        cardName = card['name'],
                        ignoreComment = _.find(comments, {
                            'commentText': o.ignoreValue
                        }),
                        ignoreCard = _.isEmpty(ignoreComment);


                    //Exclude cards which are marked as "Ignore"

                    if (ignoreCard) {

                        // Get the largest number, for a card, and treat it 
                        // as the estimate, irrespective of the date.

                        var largestValueComment = this.extractLargestCommentValue(comments),
                            remaining = this.getProgressComments(comments),
                            doneCard = _.find(comments, {
                                'commentText': o.doneValue
                            }),
                            isEmpty = _.isEmpty(doneCard),
                            isDone = (!isEmpty) ? true : false,
                            isDoneDate = (!isEmpty) ? moment(doneCard.commentDate).format('DD-MM-YYYY') : null,
                            date = moment(largestValueComment.commentDate).format('DD-MM-YYYY'),
                            //isDoneDate = (!isEmpty) ? doneCard.commentDate : null,
                            //date = largestValueComment.commentDate,
                            points = parseFloat(largestValueComment.commentText),
                            cardTitle = cardName.replace(/\((.*\) )/g, '');

                        //If there are no points on the card, but it's still flagged as "DONE", 
                        // set it to ZERO, so it adds no value
                        if (!points) {
                            points = 0;
                        }



                        // Store the card data (inc. largest estimate, when it was done etc.)
                        o.allCards.push({
                            "date": date,
                            "points": points,
                            "card": cardTitle,
                            "done": isDone,
                            "doneDate": isDoneDate,
                            "remaining": remaining
                        });


                    }


                }
            }

            //console.log(o.allCards);

            this.sortGroupAndDisplayDates();

        },


        /*
            Sort objects by unique date, and display in ascending order
        **/

        sortGroupAndDisplayDates: function () {

            // Defaults to daily sprints, if it somehow ended up here without a valid duration OR
            // if the number of days in the range, is less than the duration chosen!

            el.loading.hide();
            el.results.show();


            var fromDate = moment(o.fromDate, "DD-MM-YYYY"),
                toDate = moment(o.toDate, "DD-MM-YYYY"),
                storedDuration = parseFloat(o.duration),
                diff = Math.abs(fromDate.diff(toDate, 'days')),
                duration = (storedDuration && diff >= storedDuration) ? storedDuration : 1;

            //Update duration stored.
            o.duration = duration;

            //Check that sprint duration isn't larger than the amount of days!
            if (storedDuration > diff) {
                this.message(o.messageDiffDuration);
            }

            //Does the spring duration match the range?
            var remainder = diff % duration;

            //Not a clean sprint, round up!
            if (remainder > 0) {
                var daysToAdd = Math.abs(duration - remainder);
                toDate = moment(toDate, "DD-MM-YYYY").add(daysToAdd, 'day');
            }


            /// Create a date range
            var itr = moment.twix(fromDate, toDate).iterate(duration, "days");

            var range = [];

            while (itr.hasNext()) {
                range.push(
                    moment(itr.next().toDate()).format("DD-MM-YYYY")
                );
            }

            //Create Table & Rows            
            var tableHTML = '<table id="datesTable" class="highchart" data-graph-container="#graph" data-graph-type="line">' +
                '<thead>' +
                '<tr>' +
                '<th>Date</th>' +
                '<th>Estimated Total</th>' +
                '<th>Done</th>' +
                '<th>Velocity</th>' +
                '</tr>' +
                '</thead>';


            // Display
            var xAxisValue, itemCount = 0;

            //Shave a sprint off the table/chart when duration is over 1 day.
            // This is because sprint's actually end the day before (E.g. Monday - Sunday)
            var rangeLength = (o.duration > 1) ? range.length - 1 : range.length;

            for (var j = 0; j < rangeLength; j++) {
                itemCount++;

                //If greater than 1 day, use the terminology "Spring X" instead of the date.

                xAxisValue = (parseFloat(o.duration) > 1) ? "Sprint #" + itemCount : moment(range[j], "DD-MM-YYYY").format("DD MMM YYYY");

                tableHTML += '<tr id="' + range[j] + '">' +
                    '<td>' + xAxisValue + '</td>' +
                    '<td class="estimated"><ul class="estimated"></ul></td>' +
                    '<td class="done"><ul class="done"></ul></td>' +
                    '<td class="velocity"></td>' +
                    '</tr>';
            }

            tableHTML += "</table>";

            el.tableData.append(tableHTML);

            this.addCardsIntoSortedDates(o.fromDate, range);

        },


        /*
            Add the cards & points into it's respective date group.
            @groupedDates | Array | List of dates / points
            @range | Object | List of dates within the range!
        **/

        addCardsIntoSortedDates: function (fromDate, range) {

            var allData = o.allCards;

            //Append HTML to tables & Calculate culmative points
            this.groupCardsIntoDateRangesAndParse(allData, fromDate, range);


            // Clone Table, so we can preserve the lists inside the cells.
            // NOTE: Highcharts only wants the numeric values in table cells, can't handle extra mark-up etc!

            $(el.datesTableID).clone().addClass("cloned").appendTo("#tableData");
            $(el.datesTableID).find("ul").remove();

            // ----------------- 
            // Make a Graph - See app/Charts.js

            var table = $(el.datesTableID).get(0);
            Charts.makeChart(table, 'spline', o.boardName);

            // ----------------- 


            //Remove table which generated the chart
            $(el.datesTableID).not(".cloned").remove();

            $(".cloned tr").each(function () {
                if ($(this).find("ul li").length > 0) {
                    $(this).find("td:last-child").append("<span></span>");
                }
            });


        },

        /*
            For a given JavaScript object, this function will append the relevant HTML to a table, which is then used
            to generate the chart. It will then call the calculation functions to get totals etc.
            @data | object | comment & card data
            @fromDate | string | user defined chart start date
            @range | Object | list of dates in the range being used (e.g. weekly)
        **/

        groupCardsIntoDateRangesAndParse: function (data, fromDate, range) {

            var unixStart = moment(fromDate, "DD-MM-YYYY").unix();

            //Range will always be in ASC order!
            for (var x = 0; x < range.length; x++) {

                var last = range.length - 1,
                    rangeMin = range[x],
                    rangeMax = (x === last) ? range[x] : range[x + 1],
                    unixMin = moment(rangeMin, "DD-MM-YYYY").unix(),
                    unixMax = moment(rangeMax, "DD-MM-YYYY").unix();


                var estimates = this.getEstimatedCardsInRange(data, unixMin, unixMax);
                var done = this.getDoneCardsInRange(data, unixMin, unixMax);


                //Parsing function
                this.parseCardDataInRange("estimated", estimates, rangeMin);
                this.parseCardDataInRange("done", done, rangeMin);

            }

            //TODO: Apply some DRY to this function..

            //Next, get the "done" and "estimated" points up to our starting date..
            this.calculateDoneAndEstimatedToDate(data, unixStart);


            //Finally... go calculate!
            this.calculateCulmativePoints('done', o.doneSoFar);
            this.calculateCulmativePoints('estimated', o.estimatedSoFar);

            this.calculateVelocity();

            //Now Save into DB
            if (!o.skipSave) {
                this.saveChartAndAppendURL();
            } else {
                console.log("Don't save");
            }


        },

        /*
            Calculate velocity
        **/
        calculateVelocity: function () {
            var prev = 0,
                sprintVelocity = 0,
                totalVelocity = 0,
                totalVelocitySprints = $("td.velocity").length - 1;

            $("td.done").each(function (i) {
                var done = parseFloat($(this).data("count-done"));
                if (i > 0) {
                    sprintVelocity = done - prev;
                    totalVelocity += sprintVelocity;
                }
                $(this).next("td.velocity").append(sprintVelocity);
                prev = done;

            });

            console.log(totalVelocity + " " + totalVelocitySprints);

            //And the total average is..

            $("#velocityAverage").html("Average Project Velocity: <strong>" + Math.ceil(totalVelocity / totalVelocitySprints) + "</strong>");


        },


        /*
            Parse the data provided into the right table rows, which ultimately lead to chart generation!
            @cssClass | string | the css class to append any data
            @data | object | filtered cards to use
            @dateToUse | string | The date to append cards to - important for weekly sprints etc.
        **/

        parseCardDataInRange: function (cssClass, data, dateToUse) {
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var points = data[key]['points'],
                        card = data[key]['card'];

                    //Append all estimated regardless!
                    $("#datesTable tr#" + dateToUse + " ." + cssClass + " ul").append("<li data-points='" + points + "'><b>" + points + "</b> : " + card + "</b></li>");

                }
            }
        },


        /*
            Calculates points culmatively for a given day / sprint
            @data | object | filtered cards to use
            @unixStart | string | Unix date to use as our "starting point" for what's been done.
        **/

        calculateDoneAndEstimatedToDate: function (data, unixStart) {

            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var date = data[key]['date'],
                        doneDate = data[key]['doneDate'],
                        points = data[key]['points'],
                        unixDone = moment(doneDate, "DD-MM-YYYY").unix(),
                        unixEsti = moment(date, "DD-MM-YYYY").unix();

                    if (unixDone < unixStart) {
                        o.doneSoFar += points;
                    }

                    if (unixEsti < unixStart) {
                        o.estimatedSoFar += points;
                    }
                }
            }


        },


        /*
            Calculates points culmatively for a given day / sprint
            @type | string | which column / list to use as the source
        **/

        calculateCulmativePoints: function (type, soFar) {

            var culmativeCount = (soFar && typeof soFar === "number") ? soFar : 0;

            $("#datesTable ul." + type).each(function () {
                var count = 0,
                    points = $(this).find("li");

                points.each(function () {
                    count += parseFloat($(this).data("points"));
                });

                culmativeCount += count;
                $(this).parent().attr("data-count-" + type, culmativeCount).prepend(culmativeCount);

            });
        },

        /*
             Save the chart to the DB
        **/
        saveChartAndAppendURL: function () {
            //console.log("Sending " + o.boardName);

            var _this = this;

            // Perform ajax request and handle callback!
            this.postData().done(function (data) {
                    _this.setURLUUID(data);
                })
                .fail(function (err) {
                    console.error(err);
                });

        },

        /*
             Perform the AJAX request
        **/
        postData: function () {

            var postData = {
                board: o.boardName,
                fromDate: o.fromDate,
                toDate: o.toDate,
                duration: o.duration,
                data: JSON.stringify(o.allCards)
            };

            console.log("Posting data:");
            console.info(postData);

            var ajaxPost = $.ajax({
                type: "POST",
                url: '/chart',
                data: postData,
                dataType: 'json'
            });

            return ajaxPost;
        },


        /*
            Append the UUID to location bar
            @uuid | string | The returned UUID
        **/

        setURLUUID: function (uuid) {
            window.history.pushState("Board Saved", "New Board", '/c/' + uuid);
        },


        // ------------------------
        // HELPER METHODS
        // ------------------------

        /*
            HELPER: Sort comments by date & return text
            @comments | object | The array to sort
        **/
        extractLargestCommentValue: function (comments) {
            var commentValue = _.max(comments, function (comment) {
                return parseFloat(comment.commentText);
            });
            return commentValue;

        },

        /*
            HELPER: Get all card comments, except the estimate.
            @comments | object | The array to sort
        **/
        getProgressComments: function (comments) {

            //First, take out all "DONE" comments
            var progressComments = _.chain(comments)
                .filter(function (comment) {
                    return !isNaN(comment.commentText);
                })
                .value();

            var uniqueComments = _.map(_.groupBy(progressComments, function (comment) {
                return moment(comment.commentDate).format("DD-MM-YYYY");
            }), function (grouped) {
                return grouped[0];
            });


            return uniqueComments;
        },


        /*
            HELPER: Return an array of ESTIMATED cards which fit inside the range
            @data | object | The array to filter
            @unixMin | string | Unix time stamp 
            @unixMax | string | Unix time stamp 
        **/

        getEstimatedCardsInRange: function (data, unixMin, unixMax) {
            var estimated = _.filter(data, function (card) {
                var unixCardDate = moment(card.date, "DD-MM-YYYY").unix();
                return unixCardDate >= unixMin && unixCardDate < unixMax;
            });
            return estimated;
        },

        /*
            HELPER: Return an array of DONE cards which fit inside the range
            @data | object | The array to filter
            @unixMin | string | Unix time stamp 
            @unixMax | string | Unix time stamp 
        **/

        getDoneCardsInRange: function (data, unixMin, unixMax) {
            var done = _.filter(data, function (card) {
                var unixCardDate = moment(card.doneDate, "DD-MM-YYYY").unix();
                return card.doneDate && unixCardDate >= unixMin && unixCardDate < unixMax;
            });

            return done;
        },



        /*
            HELPER: Reset date & mark-up for a new chart!
        **/
        resetDataAndDisplay: function () {
            console.warn("Clearinig...");

            //Reset Mark-up
            el.results.hide();
            el.note.hide();
            el.tableData.empty();
            el.graph.empty();

            //Reset Data 
            o.allCards = [];
            o.estimatedSoFar = 0;
            o.doneSoFar = 0;
            o.duration = null;

        },

        /*
            HELPER: Cleans a string
            @comment | string | The comment to clean
        **/
        cleanComment: function (comment) {
            var length = comment.length - 4;
            return comment.substr(2, length);
        },


        /*
             HELPER: Write warnings to page
             @string | string | the message to display
        */

        message: function (string) {
            el.note.html(string).css("display", "block");
        }




    };

    return Scrummo;

});
