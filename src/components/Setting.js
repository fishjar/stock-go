import React, { useState } from "react";
import { Button, Drawer, Form, Row, Col, Input } from "antd";

import { defaultcCookie } from "../utils/config";

const ButtonGroup = Button.Group;

// 设置按钮组
function Setting({ form }) {
  const [showSetting, setShowSetting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const cookie = localStorage.getItem("cookie");
  const {
    getFieldDecorator,
    getFieldValue,
    resetFields,
    setFieldsValue,
  } = form;

  function handleShowSetting() {
    setShowSetting(true);
  }
  function handleCloseSetting() {
    resetFields();
    setShowSetting(false);
  }
  function handleResetSetting() {
    resetFields();
  }
  function handleSubmitSetting(e) {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      console.log(values);
      localStorage.setItem("cookie", values.cookie);
      setShowSetting(false);
    });
  }

  return (
    <div>
      <ButtonGroup>
        <Button icon="setting" onClick={handleShowSetting} />
        <Button icon="question" />
      </ButtonGroup>
      <Drawer
        title="Setting"
        width="60%"
        onClose={handleCloseSetting}
        visible={showSetting}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <Form layout="vertical">
          <Form.Item
            label="Cookie"
            hasFeedback
            help="示例：xq_a_token=b2f87b997a1558e1023f18af36cab23af8d202ea;"
          >
            {getFieldDecorator("cookie", {
              initialValue: cookie,
              // rules: [{ required: true, message: "请填写" }],
            })(<Input placeholder="请填写" />)}
          </Form.Item>
        </Form>
        <div
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: "100%",
            borderTop: "1px solid #e9e9e9",
            padding: "10px 16px",
            background: "#fff",
            textAlign: "right",
          }}
        >
          <Button onClick={handleCloseSetting} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={handleResetSetting} style={{ marginRight: 8 }}>
            Reset
          </Button>
          <Button onClick={handleSubmitSetting} type="primary">
            Submit
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

export default Form.create({ name: "Setting" })(Setting);
