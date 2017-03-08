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

    function transData(data){
        var newArr = [],
            newObj = {
                title: {
                    text: "基金"
                },
                xAxis: [{
                    data: []
                }],
                series: []
            };
        var sumFund = 0;
        for(var key in data){
            var _obj = {
                name: data[key]["name"],
                data: []
            };
            newObj.series.push(_obj);
            var funds = data[key]["funds"];
            for(var i=0;i< funds.length;i++){
                sumFund+=funds[i]["fund"]; // 求和
                // 拼接echarts数据 start
                _obj.data.push(funds[i]["fund"]);
                if(newObj.xAxis[0].data.indexOf(funds[i]["time"])<0){
                    newObj.xAxis[0].data.push(funds[i]["time"])
                }
                // 拼接echarts数据 end
            }
        }
        newObj.xAxis[0].data.sort(function(a,b){
            var aT = new Date(a),
                bT = new Date(b);
            if(aT > bT){
                return 1
            }else{
                return -1
            }
        });
        // console.log(newObj);
        newArr.push(newObj);
        return {
            chartData: newArr,
            sum: sumFund
        }
    }

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
    // console.log(my);
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