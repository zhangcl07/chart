!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("Chart",[],t):"object"==typeof exports?exports.Chart=t():e.Chart=t()}(this,function(){return function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};return t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=24)}({24:function(e,t,n){"use strict";function o(){var e=null;if(console.log(a),4===a.readyState){if(200!==a.status)throw a.responseURL+" "+a.status+" "+a.statusText;e=JSON.parse(a.response),r=e.fixData}}var r=null,a=new XMLHttpRequest;a.open("get","./../ES6/data/testdata.json",!0),a.onreadystatechange=o,a.send();var u=window.Chart,s=new u("chartsView",{type:["bar","bar","line"],common:{yLabel:["a"]}});document.getElementById("search").addEventListener("click",function(){s.loading(),setTimeout(function(){s.data=r.info,s.render()},500)},!1)}})});