registerTest ('Homepage', {
        setup:function () {
                'use strict';
        },
        load: function() {
            var workspace;
            this
     
            .test('Can a user authenticate with Trello?', function($) {
                
                var loginButton = $("#connect");

                equal(loginButton.length, 1, 'User can click Connect and proceed to the next step');
                
                // Set up the form for the next test...
                workspace = this.workspace;
                loginButton.get(0).click();
              
                
            })

            .wait(function() {
                // Waiting for page to load...
                return workspace && workspace.document.getElementById("form").style.display == 'block';
            }, 20000)

            .test('Has the user ended up on the form?', function($) {

                var isLogin = $("#form").not(":hidden") ? true : false;
                equal(isLogin, true, 'User is directed to the form');

                workspace = this.workspace;
                $("#boards").val("53eaaa0f161835ef2602d985");
                $("#startDate").val("15 October, 2014");
                $("#endDate").val("10 November, 2014");
                $("#generate").get(0).click();               
            })

            .wait(function() {
                return workspace && workspace.document.getElementById("results").style.display == 'block';
            }, 20000)

             .test('Does the data table contain valid numeric values to be charted', function($) {
                
                var tableCells = $(".summary, .done");

                 // If highcharts doesn't get generated, then data table wasn't numeric!
                var isValid = ($("svg").find("rect").length > 0) ? true : false;

                equal(isValid, 1, 'Table has valid numeric values & chart has been generated');
                
            })



        }
    }
);
