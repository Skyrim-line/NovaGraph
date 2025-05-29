import { useEffect, useState, useContext } from "react";
import {
  Button,
  Drawer,
  Form,
  InputNumber,
  Select,
  Typography,
  Space,
  ConfigProvider,
} from "antd";
import { ThemeContext } from "../context/theme";
import { CloseOutlined } from "@ant-design/icons";

const AlgorithmInput = ({
  wasmFunction,
  postState,
  setLoading,
  algorithmName,
  buttonLabel,
  desc,
  inputs,
  nodes,
  setHoveredAlgorithm,
  hoveredAlgorithm,
  handleClose,
}) => {
  const [form] = Form.useForm();

  // 引入全局主题上下文
  const { isDarkMode, currentThemeToken } = useContext(ThemeContext);

  useEffect(() => {
    const initialValues = inputs.reduce(
      (acc, input) => ({ ...acc, [input.label]: input.defaultValue }),
      {}
    );
    form.setFieldsValue(initialValues);
  }, [inputs, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading("Running algorithm...");
      handleClose();
      const args = inputs.map((input) => values[input.label]);
      const startTime = performance.now();
      const response = wasmFunction(...args);
      const endTime = performance.now();
      console.log(`Time taken for ${algorithmName}: ${endTime - startTime}ms`);
      postState(response);
    } catch (errorInfo) {
      console.error("Failed:", errorInfo);
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            borderColor: isDarkMode ? "#4d4d4d" : "#d9d9d9",
            colorBgContainer: isDarkMode ? "#EEEEEE" : "#ffffff",
            colorText: isDarkMode ? "#fff" : "#000",
            colorBorderHover: isDarkMode ? "#737373" : "#4096ff",
            colorBgElevated: isDarkMode ? "#262626" : "#ffffff", // 下拉菜单背景色
            optionSelectedBg: isDarkMode ? "#595959" : "#e6f7ff", // 选中项背景色
            optionSelectedColor: isDarkMode ? "#fff" : "#000", // 选中项文字颜色
            optionActiveBg: isDarkMode ? "#4d4d4d" : "#f5f5f5", // hover 项背景色
            selectorBg: isDarkMode ? "#262626" : "#ffffff", // 选择器背景色
          },
        },
      }}>
      <Typography.Paragraph
        style={{ color: isDarkMode ? "#ffffff" : "#000000" }}>
        {desc}
      </Typography.Paragraph>
      <Form form={form} layout="vertical">
        {inputs.map((input) => (
          <Form.Item
            key={input.label}
            label={input.label}
            name={input.label}
            rules={[{ required: true, message: `${input.label} is required` }]}
            style={{
              color: isDarkMode ? "#ffffff" : "#000000",
            }}>
            {input.type === "number" ? (
              <InputNumber
                style={{ width: "100%" }}
                step={input.step}
                controls={true}
              />
            ) : (
              <Select
                options={nodes.map((node) => ({
                  value: node.id,
                  label: node.name || node.id,
                }))}
              />
            )}
          </Form.Item>
        ))}
        <Button onClick={handleSubmit}>Submit</Button>
      </Form>
    </ConfigProvider>
  );
};

export default AlgorithmInput;
