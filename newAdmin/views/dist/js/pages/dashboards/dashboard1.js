$(function() {
    "use strict";

    // ============================================================== 
    // sales ratio
    // ============================================================== 
    var chart = new Chartist.Line('.sales', {
        labels: ["0", "2", "4", "6", "8", "10", "12", "14", "16", "18", "20", "22"],
        series: [
            [1.026, 1.395, 1.453,1.562,2.124,1.953,1.634,1.463],
        ]
    }, {
        low: 0,
        high: 4,
        showArea: true,
        fullWidth: true,
        plugins: [
            Chartist.plugins.tooltip()
        ],
        axisY: {
            onlyInteger: true,
            scaleMinSpace: 40,
            offset: 20,
            labelInterpolationFnc: function(value) {
                return (value);
            }
        },

    });

    var chart = [chart];

    // ============================================================== 
    // Our Visitor
    // ============================================================== 
    var sparklineLogin = function() {
        $('#earnings').sparkline([6, 10, 9, 11, 9, 10, 12, 10, 9, 11, 9, 10, 12, 10, 9, 11, 9], {
            type: 'bar',
            height: '40',
            barWidth: '4',
            width: '100%',
            resize: true,
            barSpacing: '8',
            barColor: '#137eff'
        });
    };
    var sparkResize;

    $(window).resize(function(e) {
        clearTimeout(sparkResize);
        sparkResize = setTimeout(sparklineLogin, 500);
    });
    sparklineLogin();
});