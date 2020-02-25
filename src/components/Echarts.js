import React, { useEffect, useRef } from "react";
import echarts from "echarts";

/**
 * 对echarts的简单封装
 * @param {*} param0
 */
export default function Echarts({
  option = null,
  width = "100%",
  height = "100vh",
  loading = false,
}) {
  const echartsEl = useRef(null);

  // 获取chart实例
  const getChart = () =>
    echarts.getInstanceByDom(echartsEl.current) ||
    echarts.init(echartsEl.current);

  // 更新参数
  useEffect(() => {
    if (option) {
      const myChart = getChart();
      myChart.setOption(option);
    }
  }, [option]);

  // 随窗口改变大小
  useEffect(() => {
    const myChart = getChart();
    myChart.resize();
  }, [width, height]);

  // 是否显示loading
  useEffect(() => {
    const myChart = getChart();
    if (loading) {
      myChart.showLoading();
    } else {
      myChart.hideLoading();
    }
  }, [loading]);

  // 销毁chart实例
  useEffect(() => {
    const myChart = getChart();
    return () => {
      myChart && myChart.dispose();
    };
  }, []);

  return <div ref={echartsEl} style={{ width, height }}></div>;
}
