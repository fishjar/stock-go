import React, { useState, useEffect } from "react";
import echarts from "echarts";

import Echarts from "./Echarts";
import { splitBlineData, calculateMA } from "../utils";

// 分时图
export default function Bline({
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
    const data = splitBlineData(rawData, menu.period);
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
          const obj = { top: 10 };
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
          start: 0,
          end: 100,
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: "slider",
          top: "85%",
          start: 0,
          end: 100,
        },
      ],
      series: [
        {
          name: menu.name,
          type: "line",
          smooth: false,
          // symbol: "none",
          sampling: "average",
          itemStyle: {
            color: "rgb(255, 70, 131)",
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#8ec6ad",
              },
              {
                offset: 1,
                color: "#ffe",
              },
            ]),
          },
          data: data.values,
          // markPoint: {
          //   data: [
          //     { type: "max", name: "最高点" },
          //     { type: "min", name: "最低点" },
          //   ],
          // },
          markLine: {
            data: [
              { type: "average", name: "平均值" },
              [
                {
                  symbol: "none",
                  x: "90%",
                  yAxis: "max",
                },
                {
                  symbol: "circle",
                  label: {
                    position: "start",
                    formatter: "最高点",
                  },
                  type: "max",
                  name: "最高点",
                },
              ],
              [
                {
                  symbol: "none",
                  x: "90%",
                  yAxis: "min",
                },
                {
                  symbol: "circle",
                  label: {
                    position: "start",
                    formatter: "最低点",
                  },
                  type: "min",
                  name: "最低点",
                },
              ],
            ],
          },
        },
        {
          name: "MA5",
          type: "line",
          data: calculateMA(5, data, "Bline"),
          smooth: true,
          symbol: "none",
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: "MA10",
          type: "line",
          data: calculateMA(10, data, "Bline"),
          smooth: true,
          symbol: "none",
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: "MA20",
          type: "line",
          data: calculateMA(20, data, "Bline"),
          smooth: true,
          symbol: "none",
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: "MA30",
          type: "line",
          data: calculateMA(30, data, "Bline"),
          smooth: true,
          symbol: "none",
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
