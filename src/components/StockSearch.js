import React, { forwardRef, useState } from "react";
import { Select } from "antd";

import { debounce } from "../utils";
import { apiSearchStock } from "../utils/api";
import { defaultStocks } from "../utils/config";

const { Option } = Select;

// 股票搜索框
function StockSearch({ value, onChange }, ref) {
  const [stocks, setStocks] = useState(defaultStocks);

  const options = stocks.map(stock => (
    <Option key={stock.code}>{`${stock.name}(${stock.code})`}</Option>
  ));
  const handleSearch = debounce(async value => {
    if (value) {
      const res = await apiSearchStock({ code: value });
      setStocks(res.stocks);
    } else {
      setStocks([]);
    }
  });
  const handleChange = value => {
    value && onChange && onChange(stocks.find(item => item.code === value));
  };

  return (
    <Select
      ref={ref}
      showSearch
      value={value}
      placeholder={"请填写"}
      defaultActiveFirstOption={false} // 是否默认高亮第一个选项。
      showArrow={false} // 是否显示下拉小箭头
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={null} // 当下拉列表为空时显示的内容
      style={{ width: 200 }}
    >
      {options}
    </Select>
  );
}

// https://ant.design/components/form-cn/#components-form-demo-customized-form-controls
// https://reactjs.org/docs/forwarding-refs.html
export default forwardRef(StockSearch);
