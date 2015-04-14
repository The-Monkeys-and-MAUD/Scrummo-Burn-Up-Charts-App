(function () {
    'use strict';

    require.config({

        shim: {
            'lodash': {
                exports: '_'
            },
            'highcharts': {
                exports: "Highcharts",
                deps: ["jquery"]
            },
            'highchartsData': {
                deps: ["highcharts"]
            },
            'highchartsExport': {
                deps: ["highcharts"]
            },
            'picker': {
                deps: ["jquery"]
            },
            'pickadate': {
                deps: ["picker"]
            }
        },

        paths: {
            "jquery": "../bower_components/jquery/dist/jquery",
            "lodash": "../bower_components/lodash/dist/lodash",
            "moment": "../bower_components/moment/moment",
            "twix": "../bower_components/twix/bin/twix",
            "picker": "../bower_components/pickadate/lib/picker",
            "pickadate": "../bower_components/pickadate/lib/picker.date",
            "highcharts": "../bower_components/highcharts/highcharts",
            "highchartsData": "../bower_components/highcharts/modules/data",
            "highchartsExport": "../bower_components/highcharts/modules/exporting",
        }
    });

    require([
            'jquery',
            'lodash',
            'app/Scrummo',
            'highcharts',
            'highchartsData',
            'highchartsExport',
        ],
        function ($, _, Scrummo) {
            Scrummo.init();
        });

})();
