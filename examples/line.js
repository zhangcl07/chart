let currentData = null;
// ajax
let ajax = new XMLHttpRequest();
ajax.open("get","./../ES6/data/testdata.json",true);
ajax.onreadystatechange = stateChange;
ajax.send();
function stateChange(){
    let data = null;
    console.log(ajax);
    if(ajax.readyState === 4){
        if (ajax.status === 200) {
            data = JSON.parse(ajax.response);
            currentData = data.fixData;
        } else {
            throw (ajax.responseURL+" "+ajax.status+" "+ajax.statusText)
        }
    }
}

let Chart = window['Chart'].Chart;
let my = new Chart("chartsView", {
    type: ["bar","bar","line"],
    common: {
        yLabel: ["a"]
    }
});
// console.log("constructor" in my);
let button = document.getElementById("search");

button.addEventListener("click",function(){
    my.loading();
    setTimeout(function(){
        my.data = currentData.info;
        my.render();
    },500);
},false);