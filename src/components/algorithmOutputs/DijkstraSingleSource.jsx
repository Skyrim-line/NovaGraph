import { useContext, useEffect } from "react";
import { Table, Typography, Space, Card, ConfigProvider } from "antd";
import { ThemeContext } from "../../context/theme";

const { Title } = Typography;
const DijkstraSingleSource = ({ data }) => {
  const { isDarkMode, currentThemeToken } = useContext(ThemeContext);
  useEffect(() => {
    // console.log(data);
  }, [data]);

  const columns = [
    {
      title: "To",
      dataIndex: "target",
      key: "target",
    },
    {
      title: "Path",
      dataIndex: "path",
      key: "path",
      render: (path) => path?.join(" → "),
    },
    data.weighted
      ? {
          title: "Weight",
          dataIndex: "weight",
          key: "weight",
        }
      : {
          title: "Length",
          dataIndex: "path",
          key: "length",
          render: (path) => path?.length,
        },
  ];

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Drawer: {
              colorBgElevated: isDarkMode
                ? currentThemeToken.color3
                : "#ffffff",
              colorText: currentThemeToken.colorText,
            },
            Table: {
              headerBg: isDarkMode ? "#333333" : "#f5f5f5",
              headerColor: isDarkMode ? "#ffffff" : "#000000",
              borderColor: isDarkMode ? "#444444" : "#d9d9d9",
              rowHoverBg: isDarkMode ? "#444444" : "#f5f5f5",
              colorText: currentThemeToken.colorText,
              colorBgContainer: isDarkMode
                ? currentThemeToken.color3
                : "#ffffff",
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
            Dijkstra's Shortest Path from [{data.source}] to All
          </Title>

          <Space direction="vertical" style={{ marginTop: 16, width: "100%" }}>
            <Table
              dataSource={data.paths.map((p, index) => ({ key: index, ...p }))}
              columns={columns}
              pagination={false}
              style={{ marginTop: 16 }}
            />
          </Space>
        </Card>
      </ConfigProvider>
    </>
  );
};

export default DijkstraSingleSource;
