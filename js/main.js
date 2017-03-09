/**
 * Created by Administrator on 2017/3/6.
 */
;(function (root, document) {
    var currentData = null;

    // ajax
    var ajax = new XMLHttpRequest();
    ajax.open("get","/chart/data/testdata.json",true);
    ajax.onload = function(res){
        if (ajax.status == 200) {
            var data = JSON.parse(ajax.response);
            currentData = data.mapData;
        } else {
            throw (ajax.responseURL+" "+ajax.status+" "+ajax.statusText)
        }
    };
    ajax.send();

    var my = new Chart("chartsView", {
        height: "480px",
        type: "map",
        common: {
            series: {
                mapType: 'china',
                itemStyle: {
                    normal: { label: { show: true } },
                    emphasis: { label: { show: true } }
                }
            }
            // 折线图加线
            // series: {
            //     markLine: {
            //         data: [{
            //             name: '平均线',
            //             // 支持 'average', 'min', 'max'
            //             type: 'average'
            //         }]
            //
            //     }
            // }
            // series: {
            //     label: {
            //         normal: {
            //             textStyle: {
            //                 color: '#000'
            //             },
            //             show: true,
            //             position: 'inside',
            //             formatter: '{a}'
            //         }
            //     }
            // },
            // yLabel: ["百分比"],
            // xLabel: ["百分比"]
            // axisIndex: [0,0,1]
        }
    });
    console.log(my);
    var button = document.getElementById("search");
    button.addEventListener("click",function(){
        my.loading();
        setTimeout(function(){
            // currentData.info[0].title.text = Date.now();

            // 地图需要设置区间
            extend(currentData.info[0],{
                visualMap: {
                    min: 0,
                    max: parseInt(currentData.info[0].series[0].data[0].value)
                }
            });
            my.data = currentData.info;
            my.render()
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