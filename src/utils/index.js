import moment from "moment";
// moment.locale();

// K线数据处理
export function splitKlineData(rawData, period = "1d") {
  const categoryData = [];
  const values = [];
  const volumes = [];
  for (let i = 0; i < rawData.length; i++) {
    if (["day", "week", "month", "quarter", "year"].includes(period)) {
      categoryData.push(moment(rawData[i][0]).format("YYYY-MM-DD"));
    } else {
      categoryData.push(moment(rawData[i][0]).format("MM-DD HH:mm"));
    }
    values.push([
      rawData[i][2],
      rawData[i][5],
      rawData[i][4],
      rawData[i][3],
      rawData[i][1],
    ]);
    volumes.push([i, rawData[i][1], rawData[i][2] > rawData[i][5] ? 1 : -1]);
  }

  return {
    categoryData,
    values,
    volumes,
  };
}

// 分时数据处理
export function splitBlineData(rawData, period = "1d") {
  const categoryData = [];
  const values = [];
  const volumes = [];
  for (let i = 0; i < rawData.length; i++) {
    if (period === "1d") {
      categoryData.push(moment(rawData[i].timestamp).format("HH:mm"));
    } else {
      categoryData.push(moment(rawData[i].timestamp).format("MM-DD HH:mm"));
    }
    values.push(rawData[i].current);
    if (i === 0) {
      volumes.push([i, rawData[i].volume, 1]);
    } else {
      volumes.push([
        i,
        rawData[i].volume,
        rawData[i].volume > rawData[i - 1].volume ? 1 : -1,
      ]);
    }
  }

  return {
    categoryData,
    values,
    volumes,
  };
}

// 均线数据处理
export function calculateMA(dayCount, data, lineType = "kline") {
  const result = [];
  for (let i = 0, len = data.values.length; i < len; i++) {
    if (i < dayCount) {
      result.push("-");
      continue;
    }
    let sum = 0;
    for (let j = 0; j < dayCount; j++) {
      if (lineType === "kline") {
        sum += data.values[i - j][1];
      } else {
        sum += data.values[i - j];
      }
    }
    result.push(+(sum / dayCount).toFixed(3));
  }
  return result;
}

// 简单防抖函数
// 单位时间内定时器重新启动
export function debounce(fn, delay = 1000) {
  let timer = null; // 声明计时器
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  };
}

// 简单节流函数
// 单位时间内必定执行一次
export function throttle(fn, delay = 250) {
  let timer = null; // 声明计时器
  let lastTime = Date.now();
  return function() {
    const now = Date.now();
    if (now > lastTime + delay) {
      // 时间到
      lastTime = now;
      fn();
    } else {
      // 时间未到
      clearTimeout(timer);
      timer = setTimeout(fn, delay); // 保证至少会执行一次
    }
  };
}

/**
 * 写入浏览器缓存
 * @param {String} key
 * @param {*} data
 */
export const writeLocalStorage = (key, data) => {
  if (!key) {
    return;
  }
  if (data !== null && typeof data === "object") {
    localStorage.setItem(key, JSON.stringify(data));
    return;
  }
  localStorage.setItem(key, data);
};

/**
 * 读取浏览器缓存
 * @param {String} key
 */
export const readLocalStorage = key => {
  if (!key) {
    return null;
  }
  const data = localStorage.getItem(key);
  try {
    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
  return data;
};
