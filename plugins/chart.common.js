/**
 * Created by Administrator on 2017/3/6.
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
            height: "480px",
            type: "",
            common: {
                series: {}, //公共样式
                yLabel: "", //y轴label文案
                xLabel: "", //x轴label文案
                showTooltips: true //是否显示tooltips
            }
        },
        loading: function(){
            this.ECHART.showLoading({
                text: '加载中',
                color: '#28AAE4',
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
            if(this.options.type.indexOf("|") < 0){
                opt = this[this.options.type](this.data)
            }else{
                opt = this["fix"]()
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
            return series.map(function(c){
                return c.name
            });
        },
        line: function(data){
            return this["category"](data)
        },
        bar: function(data){
            return this["category"](data)
        },
        category: function(data){
            var self = this,
                optionsCommon = this.options.common,
                __data = data[0],
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
                        type: 'value',
                        name: optionsCommon.yLabel || '',
                        axisTick: {
                            show: false
                        }
                    }
                ],
                xAxis: [
                    {
                        name: optionsCommon.xLabel || '',
                        boundaryGap: __type == 'line'?false:true,
                        axisTick: {
                            show: false
                        }
                    }
                ]
            }, __data);

        }
    };

    return Chart;

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

    /**
     * echarts3自带的方法有问题，这里换成旧版本的方法
     * 颜色加深或减淡，当level>0加深，当level<0减淡
     * @param {string} color 颜色 // 只支持hex模式 #000000
     * @param {number} level 升降程度,取值区间[-1,1]
     * @return {string} 加深或减淡后颜色值
     */
    echarts.color.lift = function (color, level) {
        var direct = level > 0 ? 1 : -1;
        if (typeof level === 'undefined') {
            level = 0;
        }
        level = Math.abs(level) > 1 ? 1 : Math.abs(level);
        var data = echarts.color.parse(color);
        for ( var i = 0; i < 3; i++) {
            if (direct === 1) {
                data[i] = Math.floor(data[i] * (1 - level));
            } else {
                data[i] = Math.floor((255 - data[i]) * level + data[i]);
            }
        }
        return 'rgba(' + data.join(',') + ')';
    };
});