/**
 * Created by zhangcl on 2017/3/6.
 * Github: https://github.com/zhangcl07/chart
 */

import {extend} from "./common/extend";
import {isArray} from "./common/isArray";

class Chart {
    constructor(selector, options) {
        // let self = this;
        // this.selector = "#"+selector;
        this.options = extend({
            height: "480px", // 自带单位px，方便自定义各种单位，如%,em,rem……
            type: "line", // type: 1.{string}代表单一类型图表；2.{array}代表混合类型图表
            common: {
                series: {}, // 公共样式
                yLabel: [], // y轴label文案,与axisIndex同时用
                xLabel: [], // x轴label文案
                showTooltips: true, //是否显示tooltips
                axisIndex: [] // 当有两个y轴显示时会用到，对应第几条数据用第几个yAxis
            }
        }, options || {});
        // console.log(this.options);
        let chartDom = null;
        try {
            chartDom = document.getElementById(selector);
            // 设置高度，默认480px
            chartDom.style.height = this.options.height || "480px";
        }
        catch (e) {
            throw ("不存在id为" + selector + "的DOM节点")
        }
        this.dom = chartDom;
        this.data = [];
        // 初始化chart
        this.ECHART = this.init();
    }

    loading() {
        this.ECHART.showLoading({
            //text: '加载中',
            //color: '#28AAE4',
            zlevel: 1
        });
    }

    init() {
        return echarts.init(this.dom, "vintage");
    }

    resize() {
        // console.log(this);
        let self = this;
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(cr);
        } else {
            setTimeout(cr, 66);
        }
        function cr() {
            self.ECHART.resize();
        }
    }

    render() {
        this.ECHART.hideLoading();
        // 空数据检查
        if (this.data.length === 0) {
            this.noDataRender();
            return;
        }
        let opt = {};
        if (typeof this.options.type === "string") { // 如果是字符串，表示单一类型
            opt = this[this.options.type]()
        } else if (isArray(this.options.type) && this.options.type.length > 0) { // 如果是数组，表示混合类型
            opt = this["fix"]()
        } else {
            throw ("数据格式出错，请确认options.type为何种图表类型！")
        }
        console.log(opt);
        this.ECHART.setOption(opt);
    }

    noDataRender() {
        this.data = [{
            title: {
                text: ""
            },
            //xAxis: [],
            series: []
        }];
        this.render();
    }

    getLegend(series) {
        switch (this.options.type) {
            case "radar":
                return loopData(series[0].data);
            default:
                return loopData(series)
        }
        function loopData(data) {
            return data.map(function (c) {
                return c.name
            });
        }
    }

    line() {
        // 给x轴加boundaryGap
        let thisData = this.data[0];
        if (thisData.xAxis) {
            if (isArray(thisData.xAxis)) {
                thisData.xAxis[0].boundaryGap = false
            } else {
                thisData.xAxis.boundaryGap = false
            }

        } else {
            thisData.xAxis = [{
                boundaryGap: false
            }];
        }
        return this["axis"]()
    }

    bar() {
        return this["axis"]()
    }

    // 纵向柱状图
    bar_v() {
        extend(this.data[0], {
            xAxis: [{
                type: "value"
            }],
            yAxis: [{
                type: "category"
            }]
        });
        this.options.type = "bar";

        return this["axis"]()
    }

    /**
     * 类目轴图表数据处理
     * @returns {*}
     */
    axis() {
        let self = this,
            optionsCommon = this.options.common,
            __data = this.data[0],
            __type = this.options.type,
            __legend = this.getLegend(__data.series);

        __data.series.forEach(function (c) {
            c.type = __type;
            if (self.options.type === 'bar' && __data.xAxis[0].type !== 'value') {
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
                    name: optionsCommon.xLabel[0] || ''
                    // ,
                    // axisLabel: {
                    //     interval: 0
                    // }
                }
            ]
        }, __data);

    }

    fix() {
        let self = this,
            optionsCommon = this.options.common,
            __data = this.data[0],
            __type = this.options.type,
            __legend = this.getLegend(__data.series);
        let __yAxis = optionsCommon.yLabel.map(function (c, i) {
            return {
                type: "value",
                name: c
            }
        });
        console.log(__yAxis);
        __data.series.forEach(function (c, i) {
            if (__type[i] === 'bar' && __data.xAxis[0].type !== 'value') {
                c.barMaxWidth = 100;
            }
            c.type = __type[i];
            c.yAxisIndex = optionsCommon.axisIndex[i];

            //混合图表样式
            extend(c, optionsCommon.series);
        });

        let __option = extend({
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
            xAxis: [],
            yAxis: [{
                type: "value"
            }]
        }, __data);

        //合并y轴
        extend(__option.yAxis,__yAxis);

        return __option;
    }

    pie() {
        return this["item"]();
    }

    radar() {
        return this["item"]();
    }

    scatter() {
        extend(this.data[0], {
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
    }

    /**
     * 无类目轴图表数据处理
     * @returns {*}
     */
    item() {
        let self = this,
            optionsCommon = this.options.common,
            __data = this.data[0],
            __type = this.options.type,
            __legend = this.getLegend(__data.series);

        __data.series.forEach(function (c) {
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
    }

    map() {
        extend(this.data[0], {
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
}

export {Chart};