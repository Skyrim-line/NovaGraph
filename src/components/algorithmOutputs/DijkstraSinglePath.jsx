import { useContext, useEffect, useState } from 'react';
import { Button, Table, Typography, Space, Drawer } from 'antd';
import { ThemeContext } from '../../context/theme';
const { Title, Text } = Typography;

const DijkstraSinglePath = ({ data }) => {
    const [open, setOpen] = useState(false);
    const { isDarkMode, currentThemeToken } = useContext(ThemeContext);

    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
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
        <div style={{
            maxWidth: 600, backgroundColor: currentThemeToken.color3,
            color: currentThemeToken.colorText, padding: '16px'
        }}>
            <Title level={2} style={{ color: currentThemeToken.colorText }}>Dijkstra's Shortest Path</Title>
            <Text strong style={{ color: currentThemeToken.colorText }}>
                From [{data.source}] to [{data.target}]
            </Text>
            <Space direction="vertical" style={{ marginTop: 16 }}>
                <Text style={{ color: currentThemeToken.colorText }}>Path Length: {data.path.length}</Text>
                {data.weighted && <Text style={{ color: currentThemeToken.colorText }}>Path Weight: {data.totalWeight}</Text>}
                <Button
                    block
                    onClick={handleClick}
                    style={{ justifyContent: 'center', backgroundColor: currentThemeToken.colorButton2, color: "white", border: "none", boxShadow: "0 2px 4px 0 rgba(0,0,0,0.2)", borderRadius: "5px" }}>
                    View Path Details
                </Button>
            </Space>

            <Drawer
                title="Dijkstra Path Details"
                placement="right"
                onClose={handleClick}
                open={open}
                width={400}
            >
                <Table
                    dataSource={data.path.map((p, index) => ({ key: index, ...p }))}
                    columns={columns}
                    pagination={false}

                />
            </Drawer>
        </div>
    );
};

export default DijkstraSinglePath;
