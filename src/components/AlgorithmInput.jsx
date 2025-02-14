import React, { useEffect, useState } from 'react';
import { Button, Drawer, Form, InputNumber, Select, Typography, Space } from 'antd';

const AlgorithmInput = ({ wasmFunction, postState, setLoading, algorithmName, buttonLabel, desc, inputs, nodes, setHoveredAlgorithm, hoveredAlgorithm }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const initialValues = inputs.reduce((acc, input) => ({ ...acc, [input.label]: input.defaultValue }), {});
    form.setFieldsValue(initialValues);
  }, [inputs, form]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading('Running algorithm...');
      handleClose();

      const args = inputs.map(input => values[input.label]);
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
      <Button
        type="primary"
        onClick={handleOpen}
        onMouseEnter={() => setHoveredAlgorithm(hoveredAlgorithm)}
        onMouseLeave={() => setHoveredAlgorithm(null)}
      >
        {buttonLabel || algorithmName}
      </Button>

      <Drawer
        title={algorithmName}
        placement="right"
        onClose={handleClose}
        open={open}
        width={400}
        extra={
          <Space>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="primary" onClick={handleSubmit}>Submit</Button>
          </Space>
        }
      >
        <Typography.Paragraph>{desc}</Typography.Paragraph>
        <Form form={form} layout="vertical">
          {inputs.map((input) => (
            <Form.Item
              key={input.label}
              label={input.label}
              name={input.label}
              rules={[{ required: true, message: `${input.label} is required` }]}
            >
              {input.type === 'number' ? (
                <InputNumber style={{ width: '100%' }} step={input.step} />
              ) : (
                <Select options={nodes.map(node => ({ value: node.id, label: node.name || node.id }))} />
              )}
            </Form.Item>
          ))}
        </Form>
      </Drawer>
    </>
  );
};

export default AlgorithmInput;
