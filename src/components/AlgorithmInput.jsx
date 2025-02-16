import React, { useEffect, useState, useContext } from 'react';
import { Button, Drawer, Form, InputNumber, Select, Typography, Space } from 'antd';
import { ThemeContext } from '../context/theme';

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
}) => {
  const [open, setOpen] = useState(false);
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading('Running algorithm...');
      handleClose();
      const args = inputs.map((input) => values[input.label]);
      const startTime = performance.now();
      const response = wasmFunction(...args);
      const endTime = performance.now();
      console.log(`Time taken for ${algorithmName}: ${endTime - startTime}ms`);
      postState(response);
    } catch (errorInfo) {
      console.error('Failed:', errorInfo);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          type="primary"
          size="large"
          style={{
            marginLeft: '20px',
            backgroundColor: isDarkMode ? currentThemeToken.colorButton2 : currentThemeToken.colorButton2,
            color: currentThemeToken.colorText2,
            border: 'none',
          }}
          onClick={handleOpen}
          onMouseEnter={() => setHoveredAlgorithm(hoveredAlgorithm)}
          onMouseLeave={() => setHoveredAlgorithm(null)}
        >
          {buttonLabel || 'Click here to View / Edit'}
        </Button>
      </div>

      <Drawer
        title={algorithmName}
        placement="left"
        onClose={handleClose}
        open={open}
        width={400}

        styles={{
          body: {
            backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
          },
          header: {
            backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#000000',
          },
          footer: {
            backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
          },
        }}
        extra={
          <Space>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Space>
        }
      >
        <Typography.Paragraph
          style={{ color: isDarkMode ? '#ffffff' : '#000000' }}
        >
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
                color: isDarkMode ? '#ffffff' : '#000000',
              }}
            >
              {input.type === 'number' ? (
                <InputNumber
                  style={{ width: '100%' }}
                  step={input.step}
                  controls={true}
                />
              ) : (
                <Select
                  options={nodes.map((node) => ({
                    value: node.id,
                    label: node.name || node.id,
                  }))}
                  style={{ backgroundColor: isDarkMode ? '#333333' : '#ffffff', color: isDarkMode ? '#ffffff' : '#000000' }}
                  dropdownStyle={{ backgroundColor: isDarkMode ? '#333333' : '#ffffff' }}
                />
              )}
            </Form.Item>
          ))}
        </Form>
      </Drawer>
    </>
  );
};

export default AlgorithmInput;
