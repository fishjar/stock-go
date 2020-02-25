import { requestXueqiu } from "./ipc";

/**
 * 获取K线数据
 */
export const apiGetKline = ({ ...params }) => {
  return requestXueqiu("https://stock.xueqiu.com/v5/stock/chart/kline.json", {
    symbol: "SH000001",
    begin: Date.now(),
    period: "day",
    type: "before",
    count: -142,
    indicator: "kline,pe,pb,ps,pcf,market_capital,agt,ggt,balance",
    ...params,
  });
};

/**
 * 获取分时数据
 */
export const apiGetBline = ({ ...params }) => {
  return requestXueqiu("https://stock.xueqiu.com/v5/stock/chart/minute.json", {
    symbol: "SH000001",
    period: "1d",
    ...params,
  });
};

/**
 * 股票搜索
 */
export const apiSearchStock = ({ ...params }) => {
  return requestXueqiu("https://xueqiu.com/stock/search.json", {
    code: "",
    size: 50,
    page: 1,
    ...params,
  });
};
