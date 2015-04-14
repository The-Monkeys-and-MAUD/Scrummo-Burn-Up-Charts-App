define(['jquery'], function ($) {
    'use strict';

    var Charts = {

        init: function () {

        },

        /*
            Parse data and create a HighCharts instance!
            @data | string | The table (data source) for the chart
            @type | string | Type of chart
            @name | string | name of board, to display on chart
        **/


        makeChart: function (data, type, name) {


            $('#graph').highcharts({
                title: {
                    text: 'BurnUp Chart for ' + name,
                    x: -20 //center
                },
                subtitle: {
                    text: 'Source: Trello.com',
                    x: -20
                },

                data: {
                    table: data
                },
                chart: {
                    type: type
                },

                colors: ['#7cb5ec', '#434348', '#A2CD5A'],

                yAxis: {
                    allowDecimals: false,
                    title: {
                        text: 'Points'
                    }
                },

                xAxis: {
                    type: 'category'
                },

                plotOptions: {
                    spline: {
                        lineWidth: 4,
                        states: {
                            hover: {
                                lineWidth: 6
                            }
                        },
                        marker: {
                            enabled: false
                        }
                    }
                },

            });

        }

    };

    return Charts;

});
