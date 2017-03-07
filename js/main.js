/**
 * Created by Administrator on 2017/3/6.
 */
;(function (root, document) {
    var lineData = {"status":1,"info":[{"title":{"text":""},"xAxis":[{"data":["2017-02-01","2017-02-02","2017-02-03","2017-02-04","2017-02-05","2017-02-06","2017-02-07","2017-02-08","2017-02-09","2017-02-10","2017-02-11","2017-02-12","2017-02-13","2017-02-14","2017-02-15","2017-02-16","2017-02-17","2017-02-18","2017-02-19","2017-02-20","2017-02-21","2017-02-22","2017-02-23","2017-02-24","2017-02-25","2017-02-26","2017-02-27","2017-02-28"]}],"series":[{"name":"\u6c7d\u8f66\u884c\u4e1a","data":[1400561,1512814,1976592,2039780,1768820,2233175,2293952,2243387,2164310,2136421,1680260,1768187,2551173,2493136,2477206,2503452,2374173,1919874,1840021,2509075,2494855,2580030,2497577,2428084,1939966,1927195,2664190,2538245]}]}]},
        barData = {"status":1,"info":[{"title":{"text":""},"xAxis":[{"data":["2016-01","2016-02","2016-03","2016-04","2016-05","2016-06","2016-07","2016-08","2016-09","2016-10","2016-11","2016-12","2017-01"]}],"series":[{"name":"\u5954\u9a70","data":[9696941,12137259,15360413,13940747,10263024,12339257,10402250,12952604,12209481,8945592,14540954,14765758,11174499]},{"name":"\u5b9d\u9a6c","data":[11700556,11148566,13492234,15947894,13623094,14660309,11764402,11974880,13708780,10504828,18047236,16098192,12045788]}]}]};

    var currentData = barData;
    var ajax = new XMLHttpRequest();
    ajax.open("get","/fund/data/config.json",true);
    ajax.onload = function(res){
        // console.log(res);
        var data = JSON.parse(res.target.response);
        // console.log(data);
        var transDataObj = transData(data);
        currentData.info = transDataObj.chartData;
        console.log(transDataObj.sum)
    };
    //ajax.send();
    var params = {
        st: "2017/01/01"
    };

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
        type: "bar",
        common: {
            yLabel: "￥"
        }
    });
    // console.log(my);
    var button = document.getElementById("search");
    button.addEventListener("click",function(){
        my.loading();
        setTimeout(function(){
            currentData.info[0].title.text = new Date().getTime();
            // testData.info[0].tooltip = {
            //     formatter: function(param){
            //         console.log(param);
            //         return param
            //     }
            // };
            my.data = currentData.info;
            my.render()
        },500);
    },false)
})(this, document);