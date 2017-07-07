import {extend} from "../src/common/extend";

let currentData = null;

// ajax
let ajax = new XMLHttpRequest();
ajax.open("get","./../ES6/data/testdata.json",true);
ajax.onload = function(res){
    if (ajax.status === 200) {
        var data = JSON.parse(ajax.response);
        currentData = data.mapData;
    } else {
        throw (ajax.responseURL+" "+ajax.status+" "+ajax.statusText)
    }
};
ajax.send();

let Chart = window['Chart'];

let views = document.getElementById("chartsView"),
    button = document.getElementById("search"),
    resizeButton = document.getElementById("resize");

let oFragmeng = document.createDocumentFragment();
for(let i=0;i<2;i++){
    let view = document.createElement("div");
    view.id = "chartView"+i;
    views.appendChild(view);
    oFragmeng.appendChild(view);
}
views.appendChild(oFragmeng);

let chartView0 = new Chart("chartView0", {
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

let chartView1 = new Chart("chartView1", {
    type: "bar_v",
    common: {
    }
});

resizeButton.addEventListener("click",function(){
    document.getElementById("chartView0").style.width = "500px";
    chartView0.resize();
},false);

button.addEventListener("click",function(){
    chartView0 && chartView0.loading();
    chartView1 && chartView1.loading();

    setTimeout(function(){
        let mapData = currentData.info[0],
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
    },500);
},false);