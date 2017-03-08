/**
 * Created by zhangcl on 2017/3/6.
 * Github: https://github.com/zhangcl07/chart
 */
(function (root, factory) {
    if ( typeof define === 'function' && define.amd ) {
        define('Chart', factory(root));
    } else if ( typeof exports === 'object' ) {
        module.exports = factory(root);
    } else {
        root.Chart = factory(root);
    }
})(window || this, function (root) {

    "use strict";

    /**
     * chart构造函数
     * @param selector : dom 's Id
     * @returns {Function} arguments:echarts 's options
     * @constructor
     */
    function Chart(selector, options){
        // var self = this;
        // this.selector = "#"+selector;

        extend(this.options, options);
        try{
            var chartDom = document.getElementById(selector);
            // 设置高度
            chartDom.style.height = options.height || "480px";
        }
        catch (e){
            throw("不存在id为"+selector+"的DOM节点")
        }
        this.dom = chartDom;
        this.data = [];
        // 初始化chart
        this.ECHART = this.init();
    }
    // 原型
    Chart.prototype = {
        constructor: Chart,
        options: {
            height: "480px", // 自带单位px，方便自定义各种单位，如%,em,rem……
            type: "line", // type: 1.{string}代表单一类型图表；2.{array}代表混合类型图表
            common: {
                series: {}, // 公共样式
                yLabel: [], // y轴label文案
                xLabel: [], // x轴label文案
                showTooltips: true, //是否显示tooltips
                axisIndex: [0,0,1] // 当有两个y轴显示时会用到，对应第几条数据用第几个yAxis
            }
        },
        loading: function(){
            this.ECHART.showLoading({
                //text: '加载中',
                //color: '#28AAE4',
                zlevel: 1
            });
        },
        init: function(){
            return echarts.init(this.dom,"vintage");
        },
        render: function(){
            this.ECHART.hideLoading();
            // 空数据检查
            if(this.data.length === 0){
                this.noDataRender();
                return;
            }
            var opt = {};
            if(typeof this.options.type === "string"){ // 如果是字符串，表示单一类型
                opt = this[this.options.type]()
            }else if(isArray(this.options.type) && this.options.type.length>0){ // 如果是数组，表示混合类型
                opt = this["fix"]()
            }else {
                throw ("数据格式出错，请确认options.type为何种图表类型！")
            }
            console.log(opt);
            this.ECHART.setOption(opt);
        },
        noDataRender: function(){
            this.data = [{
                title: {
                    text: ""
                },
                xAxis: [],
                series: []
            }];
            this.render();
        },
        getLegend: function(series){
            switch (this.options.type){
                case "radar":
                    return loopData(series[0].data);
                default:
                    return loopData(series)
            }
            function loopData(data){
                return data.map(function(c){
                    return c.name
                });
            }
        },
        line: function(){
            // 给x轴加boundaryGap
            var thisData = this.data[0];
            if(thisData.xAxis){
                if(isArray(thisData.xAxis)){
                    thisData.xAxis[0].boundaryGap = false
                }else{
                    thisData.xAxis.boundaryGap = false
                }

            }else{
                thisData.xAxis = [{
                    boundaryGap: false
                }];
            }
            return this["axis"]()
        },
        bar: function(){
            return this["axis"]()
        },
        bar_v: function(){
            extend(this.data[0],{
                xAxis: [{
                    type: "value"
                }],
                yAxis: [{
                    type: "category"
                }]
            });
            this.options.type = "bar";

            return this["axis"]()
        },
        /**
         * 类目轴图表数据处理
         * @returns {*}
         */
        axis: function(){
            var self = this,
                optionsCommon = this.options.common,
                __data = this.data[0],
                __type = this.options.type,
                __legend = this.getLegend(__data.series);

            __data.series.forEach(function(c){
                c.type = __type;
                if (self.options.type == 'bar' && __data.xAxis[0].type != 'value') {
                    c.barMaxWidth = 100;
                }
                //混合图表样式
                extend(c, optionsCommon.series)
            });

            return extend({
                legend: {
                    data: __legend
                },
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: {show: true}
                    }
                },
                yAxis: [
                    {
                        name: optionsCommon.yLabel[0] || ''
                    }
                ],
                xAxis: [
                    {
                        name: optionsCommon.xLabel[0] || '',
                        axisLabel: {
                            interval: 0
                        }
                        //boundaryGap: __type == 'line'?false:true
                    }
                ]
            }, __data);

        },
        fix: function(){
            var self = this,
                optionsCommon = this.options.common,
                __data = this.data[0],
                __type = this.options.type,
                __legend = this.getLegend(__data.series);
            var __yAxis = optionsCommon.yLabel.map(function(c,i){
                return {
                    type: "value",
                    name: c
                }
            });
            __data.series.forEach(function(c, i){
                if (__type[i] === 'bar' && __data.xAxis[0].type != 'value') {
                    c.barMaxWidth = 100;
                }
                c.type = __type[i];
                c.yAxisIndex = optionsCommon.axisIndex[i];

                //混合图表样式
                extend(c, optionsCommon.series);
            });

            var __option = extend({
                legend: {
                    data: __legend
                },
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: {show: true}
                    },
                    top: 10
                },
                xAxis: []
            }, __data);

            if(!__option.yAxis){
                __option.yAxis = __yAxis;
            }

            return __option;
        },
        pie: function(){
            return this["item"]();
        },
        radar: function(){
            return this["item"]();
        },
        scatter: function () {
            extend(this.data[0],{
                xAxis: [{
                    type: 'value'
                }],
                yAxis: [{
                    type: 'value'
                }],
                tooltip: {
                    trigger: "axis",
                    axisPointer: {
                        type: 'cross'
                    }
                }
            });
            return this["item"]();
        },
        /**
         * 无类目轴图表数据处理
         * @returns {*}
         */
        item: function(){
            var self = this,
                optionsCommon = this.options.common,
                __data = this.data[0],
                __type = this.options.type,
                __legend = this.getLegend(__data.series);

            __data.series.forEach(function(c){
                c.type = __type;
                //混合图表样式
                extend(c, optionsCommon.series)
            });

            return extend({
                legend: {
                    data: __legend
                },
                tooltip: {
                    // trigger: 'item'
                },
                toolbox: {
                    show: true,
                    feature: {
                        saveAsImage: {show: true}
                    }
                }
            }, __data);
        },
        map: function(){
            extend(this.data[0],{
                visualMap: {
                    left: "left",
                    top: "bottom",
                    orient: 'horizontal',
                    //calculable : true,
                    text: ['高', '低'] // 文本，默认为数值文本
                },
                tooltip: {
                    trigger: 'item'
                }
            });
            return this['item']();
        }
    };

    return Chart;

    /**
     * object合并函数 copy form zepto
     * @param target 合并目标项
     * @param source 要合并项
     * @param deep 是否深度合并 默认true
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

});