import React, { forwardRef } from "react";
import { Radio } from "antd";

import { stockPeriods } from "../utils/config";

// 分时菜单
function StockMenu({ value, onChange }, ref) {
  const handleChange = e => {
    onChange &&
      onChange(stockPeriods.find(item => item.period === e.target.value));
  };

  return (
    <Radio.Group
      ref={ref}
      value={value}
      onChange={handleChange}
      buttonStyle="solid"
    >
      {stockPeriods.map(item => (
        <Radio.Button value={item.period} key={item.period}>
          {item.name}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
}

// https://ant.design/components/form-cn/#components-form-demo-customized-form-controls
// https://reactjs.org/docs/forwarding-refs.html
export default forwardRef(StockMenu);
