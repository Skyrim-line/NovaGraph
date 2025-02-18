import { useContext, useEffect, useState } from 'react';
import { Button, Table, Typography, Space, Drawer, Card, Divider, ConfigProvider } from 'antd';
import { ThemeContext } from '../../context/theme';
import { LeftOutlined } from '@ant-design/icons';


const { Title, Text } = Typography;

const DijkstraSinglePath = ({ data }) => {
    const [open, setOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const { isDarkMode, currentThemeToken } = useContext(ThemeContext);

    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    };

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    const columns = data.weighted
        ? [
            { title: 'From', dataIndex: 'from', key: 'from' },
            { title: 'To', dataIndex: 'to', key: 'to' },
            { title: 'Weight', dataIndex: 'weight', key: 'weight' },
        ]
        : [
            { title: 'From', dataIndex: 'from', key: 'from' },
            { title: 'To', dataIndex: 'to', key: 'to' },
        ];

    return (
        <ConfigProvider
            theme={{
                components: {
                    Drawer: {
                        colorBgElevated: isDarkMode ? currentThemeToken.color3 : '#ffffff',
                        colorText: currentThemeToken.colorText,
                    },
                    Table: {
                        headerBg: isDarkMode ? '#333333' : '#f5f5f5',
                        headerColor: isDarkMode ? '#ffffff' : '#000000',
                        borderColor: isDarkMode ? '#444444' : '#d9d9d9',
                        rowHoverBg: isDarkMode ? '#444444' : '#f5f5f5',
                        colorText: currentThemeToken.colorText,
                        colorBgContainer: isDarkMode ? currentThemeToken.color3 : '#ffffff',
                    },
                },
            }}
        >
            {/* 折叠状态：显示一个窄条 */}
            {collapsed && (
                <div
                    onClick={toggleCollapse}
                    style={{
                        width: '40px',
                        height: '150px',
                        backgroundColor: currentThemeToken.color3,
                        color: currentThemeToken.color3,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: '0px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    {/* 向左箭头图标 */}
                    <LeftOutlined style={{ fontSize: '20px', color: currentThemeToken.colorText }} />
                    <Text
                        style={{
                            writingMode: 'vertical-rl', // 文字竖排
                            textOrientation: 'mixed',
                            fontSize: '16px',
                            color: currentThemeToken.colorText,
                            marginTop: '8px', // 图标和文字之间的间距
                        }}
                    >
                        Show Results
                    </Text>
                </div>
            )}

            {/* 展开状态：显示完整卡片 */}
            {!collapsed && (
                <Card
                    style={{
                        maxWidth: 600,
                        backgroundColor: currentThemeToken.color3,
                        color: currentThemeToken.colorText,
                        borderRadius: '0px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        padding: '24px',
                    }}
                    bordered={false}
                >
                    <Title level={3} style={{ color: currentThemeToken.colorText, marginBottom: '8px', fontSize: '28px' }}>
                        Dijkstra's Shortest Path
                    </Title>
                    <Divider style={{ backgroundColor: isDarkMode ? '#fff' : '#000' }} />

                    <Text strong style={{ color: currentThemeToken.colorText, fontSize: '18px' }}>
                        From [{data.source}] to [{data.target}]
                    </Text>

                    <Space direction="vertical" style={{ marginTop: 16, width: '100%' }}>
                        <Text style={{ color: currentThemeToken.colorText, fontSize: '18px' }}>Path Length: {data.path.length}</Text>
                        {data.weighted && (
                            <Text style={{ color: currentThemeToken.colorText }}>Path Weight: {data.totalWeight}</Text>
                        )}
                        <Button
                            block
                            onClick={handleClick}
                            style={{
                                backgroundColor: currentThemeToken.colorButton2,
                                color: 'white',
                                border: 'none',
                                boxShadow: '0 3px 6px rgba(0, 0, 0, 0.2)',
                                borderRadius: '6px',
                                height: '40px',
                                fontSize: '18px',
                            }}
                        >
                            View Path Details
                        </Button>
                        <Button
                            block
                            onClick={toggleCollapse}
                            style={{
                                marginTop: '8px',
                                backgroundColor: isDarkMode ? '#ff4d4f' : '#ff7875',
                                color: 'white',
                                border: 'none',
                                boxShadow: '0 3px 6px rgba(0, 0, 0, 0.2)',
                                borderRadius: '6px',
                                height: '40px',
                                fontSize: '18px',
                            }}
                        >
                            Close Content
                        </Button>
                    </Space>
                </Card>
            )}

            <Drawer
                title={
                    <Title level={4} style={{ color: currentThemeToken.colorText, margin: 0 }}>
                        Dijkstra Path Details
                    </Title>
                }
                placement="right"
                onClose={handleClick}
                open={open}
                width={420}
                styles={{
                    header: {
                        backgroundColor: isDarkMode ? currentThemeToken.color3 : '#ffffff',
                        borderBottom: `1px solid ${isDarkMode ? '#444' : '#f0f0f0'}`,
                    },
                    body: {
                        backgroundColor: isDarkMode ? currentThemeToken.color3 : '#ffffff',
                    },
                }}
            >
                <Table
                    dataSource={data.path.map((p, index) => ({ key: index, ...p }))}
                    columns={columns}
                    pagination={false}
                />
            </Drawer>
        </ConfigProvider>
    );
};

export default DijkstraSinglePath;