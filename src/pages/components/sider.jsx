/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Layout, Menu, Input } from 'antd';
import { NodeIndexOutlined, MoreOutlined, TeamOutlined, PicCenterOutlined, SearchOutlined } from '@ant-design/icons';
import '../pages.css';
import { set } from 'lodash';

const { Sider } = Layout;
const { Search } = Input;

// 左侧菜单栏组件
const SideMenu = ({ isDarkMode, searchTerm }) => {
    const [openKeys, setOpenKeys] = useState([]);

    const handleOpenChange = (keys) => {
        setOpenKeys(keys);
    };

    // 定义菜单数据
    const menuData = [
        { icon: <NodeIndexOutlined />, title: "Path Finding & Search" },
        {
            icon: <PicCenterOutlined />,
            title: "Centrality",
            children: [
                { title: "Option 3" },
                { title: "Option 4" },
                { title: "Option 5" },
            ],
        },
        { icon: <TeamOutlined />, title: "Community Detection" },
        { icon: <MoreOutlined />, title: "Other Algorithms" },
    ];

    // 根据搜索框过滤菜单项
    const filteredMenu = menuData.filter((item) => {
        if (item.children) {
            item.children = item.children.filter((child) =>
                child.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            return item.children.length > 0 || item.title.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return item.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // 渲染菜单
    const renderMenuItems = (menu) =>
        menu.map((item, index) => {
            if (item.children) {
                return (
                    <Menu.SubMenu key={index} icon={item.icon} title={item.title}>
                        {renderMenuItems(item.children)}
                    </Menu.SubMenu>
                );
            }
            return (
                <Menu.Item key={index} icon={item.icon}>
                    {item.title}
                </Menu.Item>
            );
        });

    return (
        <Menu
            theme={isDarkMode ? "dark" : "light"}
            mode="inline"
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
        >
            {renderMenuItems(filteredMenu)}
        </Menu>
    );
};

const LeftSider = ({ collapsed = false, setCollapsed = () => { }, isDarkMode = false }) => {
    const [searchTerm, setSearchTerm] = useState(""); // 搜索框输入状态
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <Sider
            width={350}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            theme={isDarkMode ? "dark" : "light"}
        >

            {/* Logo */}
            <div className="font-logo" style={{ color: isDarkMode ? '#fff' : '#000', padding: "10px" }}>
                {collapsed ? (
                    <span style={{ fontFamily: 'ITC Eras Demi' }}>N</span>
                ) : (
                    <>
                        <span style={{ fontFamily: 'ITC Eras Book' }}>Nova</span>
                        <span style={{ fontFamily: 'ITC Eras Demi' }}>graph</span>
                    </>
                )}
            </div>
            {/* 搜索框 */}
            <div style={{ padding: "10px" }}>
                {collapsed ? (
                    // 折叠状态下只显示 Search 图标
                    <SearchOutlined
                        onClick={() => setCollapsed(false)} // 点击图标展开搜索框
                        style={{
                            fontSize: "20px",
                            cursor: "pointer",
                            marginLeft: "20px",
                            color: isDarkMode ? "#EEEEEE" : "#000",
                        }}

                    />
                ) : (
                    // 展开状态下显示完整的搜索框
                    <Search
                        placeholder="Search Algorithms Here"
                        onChange={handleSearch}
                        allowClear
                        enterButton
                        className="custom-search"
                        style={{ width: "100%" }}
                    />
                )}
            </div>
            {/* 侧边菜单 */}
            <SideMenu isDarkMode={isDarkMode} searchTerm={searchTerm} />
        </Sider>
    );
};

export default LeftSider;