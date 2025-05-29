import { useContext, useEffect } from "react";
import { Table, Typography, Space, Card, ConfigProvider } from "antd";
import { ThemeContext } from "../../context/theme";

const { Title, Text } = Typography;

const BFS = ({ data }) => {
  const { isDarkMode, currentThemeToken } = useContext(ThemeContext);

  useEffect(() => {
    // console.log(data);
  }, [data]);

  // 构建表格数据（加 key）
  const tableData = Array.isArray(data?.layers)
    ? data.layers.map((layer, index) => ({
        key: index,
        index, // depth
        nodes: Array.isArray(layer.layer)
          ? layer.layer.join(", ")
          : JSON.stringify(layer.layer),
      }))
    : [];

  const columns = [
    {
      title: "Depth",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Nodes",
      dataIndex: "nodes",
      key: "nodes",
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Drawer: {
            colorBgElevated: isDarkMode ? currentThemeToken.color3 : "#ffffff",
            colorText: currentThemeToken.colorText,
          },
          Table: {
            headerBg: isDarkMode ? "#333333" : "#f5f5f5",
            headerColor: isDarkMode ? "#ffffff" : "#000000",
            borderColor: isDarkMode ? "#444444" : "#d9d9d9",
            rowHoverBg: isDarkMode ? "#444444" : "#f5f5f5",
            colorText: currentThemeToken.colorText,
            colorBgContainer: isDarkMode ? currentThemeToken.color3 : "#ffffff",
          },
        },
      }}>
      <Card
        style={{
          backgroundColor: currentThemeToken.color3,
          color: currentThemeToken.colorText,
          borderRadius: "0px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
        bordered={false}>
        <Title
          level={3}
          style={{
            color: currentThemeToken.colorText,
            marginBottom: "8px",
            fontSize: "28px",
            marginTop: 0,
          }}>
          BFS Traversal from [{data.source}]
        </Title>

        <Space direction="vertical" style={{ marginTop: 16, width: "100%" }}>
          <Text style={{ color: currentThemeToken.colorText }}>
            Number of layers: {data.layers.length - 1}
          </Text>
          <Text style={{ color: currentThemeToken.colorText }}>
            Nodes Found: {data.nodesFound}
          </Text>

          <Table
            dataSource={tableData}
            columns={columns}
            pagination={false}
            style={{ marginTop: 16 }}
          />
        </Space>
      </Card>
    </ConfigProvider>
  );
};

export default BFS;
