import React, { useEffect, useState } from "react";
import "./App.css";
import "antd/dist/antd.css";

import { apiGetKline, apiGetBline } from "./utils/api";
import { stockPeriods, defaultStocks } from "./utils/config";
import { throttle } from "./utils";
import Kline from "./components/Kline";
import Bline from "./components/Bline";
import StockSearch from "./components/StockSearch";
import StockMenu from "./components/StockMenu";
import Setting from "./components/Setting";

import packageJson from "../package.json";

import { Layout, Row, Col, message } from "antd";

const { Content } = Layout;

function App() {
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]); // 窗口大小
  const [data, setData] = useState([]); // 原始数据
  const [loading, setLoading] = useState(true);
  const [stock, setStock] = useState(defaultStocks[0]); // 选中股票
  const [menu, setMenu] = useState(stockPeriods[0]); // 选中菜单

  // 设置标题
  useEffect(() => {
    document.title = `Stock Go (v${packageJson.version}) [${packageJson.author}]`;
  }, []);

  // 检测窗口大小
  useEffect(() => {
    window.addEventListener(
      "resize",
      throttle(() => {
        setWindowSize([window.innerWidth, window.innerHeight]);
      })
    );
    return () => {
      window.removeEventListener("resize");
    };
    // window.onresize = () => {
    //   setWindowSize([window.innerWidth, window.innerHeight]);
    // };
  }, []);

  // 获取数据
  useEffect(() => {
    if (stock && menu) {
      setLoading(true);
      if (menu.period === "1d") {
        featchBlineData({ symbol: stock.code, period: menu.period });
        const timer = setInterval(() => {
          featchBlineData({ symbol: stock.code, period: menu.period });
        }, 10000);
        return () => {
          clearInterval(timer);
        };
      } else if (menu.period === "5d") {
        featchBlineData({ symbol: stock.code, period: menu.period });
      } else if (
        ["day", "week", "month", "quarter", "year"].includes(menu.period)
      ) {
        featchKlineData({
          symbol: stock.code,
          period: menu.period,
          count: -999,
        });
      } else if (
        ["120m", "60m", "30m", "15m", "5m", "1m"].includes(menu.period)
      ) {
        featchKlineData({
          symbol: stock.code,
          period: menu.period,
          count: -999,
        });
        const timer = setInterval(() => {
          featchKlineData({
            symbol: stock.code,
            period: menu.period,
            count: -999,
          });
        }, 10000);
        return () => {
          clearInterval(timer);
        };
      }
    }
  }, [stock, menu]);

  // 获取K线数据
  async function featchKlineData(params) {
    try {
      // setLoading(true);
      const res = await apiGetKline(params);
      console.log("res", res);
      setData(res.data.item);
    } catch (err) {
      console.log(err);
      message.error("数据请求错误！如持续错误，请检查设置cookie");
    } finally {
      setLoading(false);
    }
  }

  // 获取分时数据
  async function featchBlineData(params) {
    try {
      // setLoading(true);
      const res = await apiGetBline(params);
      console.log("res", res);
      setData(res.data.items);
    } catch (err) {
      console.log(err);
      message.error("数据请求错误！如持续错误，请检查设置cookie");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="App">
      <Layout
        className="layout"
        style={{ height: "100vh", overflow: "hidden" }}
      >
        <Content>
          <Row
            type="flex"
            align="middle"
            justify="space-between"
            style={{ height: 50, padding: "0 12px" }}
          >
            <Col>
              <Row gutter={12} type="flex">
                <Col>
                  <StockSearch
                    value={stock && stock.code}
                    onChange={setStock}
                  />
                </Col>
                <Col>
                  <StockMenu value={menu.period} onChange={setMenu} />
                </Col>
              </Row>
            </Col>
            <Col>
              <Setting />
            </Col>
          </Row>
          {menu && menu.dataType === "bline" && (
            <Bline
              rawData={data}
              loading={loading}
              width={windowSize[0]}
              height={windowSize[1] - 50}
              title={stock && `${stock.name}(${stock.code})`}
              menu={menu}
            />
          )}
          {menu && menu.dataType === "kline" && (
            <Kline
              rawData={data}
              loading={loading}
              width={windowSize[0]}
              height={windowSize[1] - 50}
              title={stock && `${stock.name}(${stock.code})`}
              menu={menu}
            />
          )}
        </Content>
      </Layout>
    </div>
  );
}

export default App;
