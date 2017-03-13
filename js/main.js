/**
 * Created by Administrator on 2017/3/6.
 */
;(function (root, document) {
    var currentData = null;

    // ajax
    var ajax = new XMLHttpRequest();
    ajax.open("get","/chart/data/testdata.json",true);
    ajax.onload = function(res){
        if (ajax.status === 200) {
            var data = JSON.parse(ajax.response);
            currentData = data.mapData;
        } else {
            throw (ajax.responseURL+" "+ajax.status+" "+ajax.statusText)
        }
    };
    ajax.send();

    // var my = new Chart("chartsView", {
    //     type: "map",
    //     common: {
    //         series: {
    //             mapType: 'china',
    //             itemStyle: {
    //                 normal: { label: { show: true } },
    //                 emphasis: { label: { show: true } }
    //             }
    //         }
    //         // 折线图加线
    //         // series: {
    //         //     markLine: {
    //         //         data: [{
    //         //             name: '平均线',
    //         //             // 支持 'average', 'min', 'max'
    //         //             type: 'average'
    //         //         }]
    //         //
    //         //     }
    //         // }
    //         // series: {
    //         //     label: {
    //         //         normal: {
    //         //             textStyle: {
    //         //                 color: '#000'
    //         //             },
    //         //             show: true,
    //         //             position: 'inside',
    //         //             formatter: '{a}'
    //         //         }
    //         //     }
    //         // },
    //         // yLabel: ["百分比"],
    //         // xLabel: ["百分比"]
    //         // axisIndex: [0,0,1]
    //     }
    // });
    // console.log("constructor" in my);
    var views = document.getElementById("chartsView"),
        button = document.getElementById("search"),
        resizeButton = document.getElementById("resize");

    var oFragmeng = document.createDocumentFragment();
    for(var i=0;i<2;i++){
        var view = document.createElement("div");
        view.id = "chartView"+i;
        views.appendChild(view);
        oFragmeng.appendChild(view);
    }
    views.appendChild(oFragmeng);

    var chartView0 = new Chart("chartView0", {
        type: "map",
        common: {
            series: {
                mapType: 'china',
                itemStyle: {
                    normal: {label: {show: true}},
                    emphasis: {label: {show: true}}
                }
            }
        }
    });

    var chartView1 = new Chart("chartView1", {
        type: "bar_v",
        common: {
        }
    });

    resizeButton.addEventListener("click",function(){
        document.getElementById("chartView0").style.width = "500px";
        chartView0.resize();
    },false);
    button.addEventListener("click",function(){
        // my.loading();
        chartView0 && chartView0.loading();
        chartView1 && chartView1.loading();

        setTimeout(function(){
            // currentData.info[0].title.text = Date.now();

            var mapData = currentData.info[0],
                barData = currentData.info[1];

            // 地图需要设置区间
            extend(mapData,{
                visualMap: {
                    min: 0,
                    max: parseInt(currentData.info[0].series[0].data[0].value)
                }
            });

            chartView0.data = [mapData];
            chartView1.data = [barData];
            chartView0.render();
            chartView1.render();

            // my.data = currentData.info;

        },500);
    },false)



    /**
     * object合并函数 copy form zepto
     * @param target 合并目标项
     * @param source 要合并项
     * @param deep 默认true
     */
    function extend(target, source, deep) {
        if(typeof deep != 'boolean')deep = true;
        for (var key in source) {
            if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                if (isPlainObject(source[key]) && !isPlainObject(target[key]))
                    target[key] = {};
                if (isArray(source[key]) && !isArray(target[key]))
                    target[key] = [];
                extend(target[key], source[key], deep)
            }
            else if (source[key] !== undefined) target[key] = source[key]
        }

        return target
    }

    // 真object判断
    function isPlainObject(obj) {
        return Object.prototype.toString.call( obj ) === "[object Object]";
    }
    // 数组判断
    function isArray(obj){
        return Array.isArray(obj);
    }
})(this, document);