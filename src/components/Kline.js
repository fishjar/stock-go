import React, { useState, useEffect } from "react";

import Echarts from "./Echarts";
import { splitKlineData, calculateMA } from "../utils";

// K线图
export default function Kline({
  rawData = [],
  title = "××指数",
  menu = {},
  ...props
}) {
  const [option, setOption] = useState(null);

  useEffect(() => {
    const upColor = "#ec0000";
    const upBorderColor = "#8A0000";
    const downColor = "#00da3c";
    const downBorderColor = "#008F28";
    const data = splitKlineData(rawData, menu.period);
    // console.log("data", data);

    setOption({
      title: {
        text: title,
        left: 10,
      },
      backgroundColor: "#fff",
      // animation: false,
      legend: {
        // bottom: 10,
        // left: "center",
        data: [menu.name, "MA5", "MA10", "MA20", "MA30"],
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
        backgroundColor: "rgba(245, 245, 245, 0.8)",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        textStyle: {
          color: "#000",
        },
        position: function(pos, params, el, elRect, size) {
          var obj = { top: 10 };
          obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 30;
          return obj;
        },
        // extraCssText: 'width: 170px'
      },
      axisPointer: {
        link: { xAxisIndex: "all" },
        label: {
          backgroundColor: "#777",
        },
      },
      // 右上角工具按钮
      toolbox: {
        feature: {
          saveAsImage: {
            show: true,
            title: "Save As Image",
          },
          dataZoom: {
            yAxisIndex: false,
          },
          brush: {
            type: ["lineX", "clear"],
          },
        },
      },
      brush: {
        xAxisIndex: "all",
        brushLink: "all",
        outOfBrush: {
          colorAlpha: 0.1,
        },
      },
      visualMap: {
        show: false,
        seriesIndex: 5,
        dimension: 2,
        pieces: [
          {
            value: 1,
            color: downColor,
          },
          {
            value: -1,
            color: upColor,
          },
        ],
      },
      grid: [
        {
          left: "10%",
          right: "8%",
          height: "50%",
        },
        {
          left: "10%",
          right: "8%",
          top: "63%",
          height: "16%",
        },
      ],
      xAxis: [
        {
          type: "category",
          data: data.categoryData,
          scale: true,
          boundaryGap: false,
          axisLine: { onZero: false },
          splitLine: { show: false },
          splitNumber: 20,
          min: "dataMin",
          max: "dataMax",
          axisPointer: {
            z: 100,
          },
        },
        {
          type: "category",
          gridIndex: 1,
          data: data.categoryData,
          scale: true,
          boundaryGap: false,
          axisLine: { onZero: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          splitNumber: 20,
          min: "dataMin",
          max: "dataMax",
        },
      ],
      yAxis: [
        {
          scale: true,
          splitArea: {
            show: true,
          },
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
        },
      ],
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: [0, 1],
          start: 80,
          end: 100,
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: "slider",
          top: "85%",
          start: 80,
          end: 100,
        },
      ],
      series: [
        {
          name: menu.name,
          type: "candlestick",
          data: data.values,
          // dimensions: [
          //   { name: "good", displayName: "good", type: "number" },
          //   { name: "a", displayName: "a", type: "number" },
          // ],
          // dimensions: ["open", "close", "highest", "lowest"],
          itemStyle: {
            color: upColor,
            color0: downColor,
            borderColor: null,
            borderColor0: null,
          },
          // tooltip: {
          //   formatter: function(param) {
          //     param = param[0];
          //     return [
          //       "Date: " + param.name + '<hr size=1 style="margin: 3px 0">',
          //       "Open: " + param.data[0] + "<br/>",
          //       "Close: " + param.data[1] + "<br/>",
          //       "Lowest: " + param.data[2] + "<br/>",
          //       "Highest: " + param.data[3] + "<br/>",
          //     ].join("");
          //   },
          // },
          markPoint: {
            label: {
              normal: {
                formatter: function(param) {
                  return param != null ? Math.round(param.value) : "";
                },
              },
            },
            data: [
              // {
              //   name: "XX标点",
              //   coord: ["2013/5/31", 2300],
              //   value: 2300,
              //   itemStyle: {
              //     color: "rgb(41,60,85)",
              //   },
              // },
              {
                name: "highest value",
                type: "max",
                valueDim: "highest",
              },
              {
                name: "lowest value",
                type: "min",
                valueDim: "lowest",
              },
              {
                name: "average value on close",
                type: "average",
                valueDim: "close",
              },
            ],
            tooltip: {
              formatter: function(param) {
                return param.name + "<br>" + (param.data.coord || "");
              },
            },
          },
          markLine: {
            symbol: ["none", "none"],
            data: [
              [
                {
                  name: "from lowest to highest",
                  type: "min",
                  valueDim: "lowest",
                  symbol: "circle",
                  symbolSize: 10,
                  label: {
                    show: false,
                  },
                  emphasis: {
                    label: {
                      show: false,
                    },
                  },
                },
                {
                  type: "max",
                  valueDim: "highest",
                  symbol: "circle",
                  symbolSize: 10,
                  label: {
                    show: false,
                  },
                  emphasis: {
                    label: {
                      show: false,
                    },
                  },
                },
              ],
              {
                name: "min line on close",
                type: "min",
                valueDim: "close",
              },
              {
                name: "max line on close",
                type: "max",
                valueDim: "close",
              },
            ],
          },
        },
        {
          name: "MA5",
          type: "line",
          data: calculateMA(5, data),
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: "MA10",
          type: "line",
          data: calculateMA(10, data),
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: "MA20",
          type: "line",
          data: calculateMA(20, data),
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: "MA30",
          type: "line",
          data: calculateMA(30, data),
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: "成交量",
          type: "bar",
          barWidth: "50%",
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: data.volumes,
        },
      ],
    });
  }, [rawData]);

  return <Echarts option={option} {...props}></Echarts>;
}
