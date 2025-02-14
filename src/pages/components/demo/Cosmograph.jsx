import React, { useContext, useState } from "react";
import { Layout } from "antd";
import { ThemeContext } from "../context/theme"; // 引入主题上下文
import { GraphRenderer } from "../components/GraphRenderer"; // 示例：你的图渲染组件

const { Content } = Layout;

function Cosmograph() {
    // 从 ThemeContext 中获取当前主题 token（暗/亮模式对映的颜色等）
    const { currentThemeToken } = useContext(ThemeContext);

    // 你自己的状态
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [colorMap, setColorMap] = useState({});
    const [directed, setDirected] = useState(false);
    const [renderMode, setRenderMode] = useState(1);

    return (
        <Layout>
            <Content>
                <div style={{ padding: 24, background: currentThemeToken.color2 }}>
                    Search Box
                </div>
                {/* 主内容区域和右侧 Sider 使用 flex 布局 */}
                <div
                    style={{
                        display: "flex",
                        background: currentThemeToken.colorBgContainer,
                        minHeight: "100vh",
                    }}
                >
                    {/* 左侧主内容区域 */}
                    <div
                        style={{
                            flex: 1,
                            padding: "24px",
                            background: currentThemeToken.color3,
                        }}
                    >
                        Bill is a cat.
                        <GraphRenderer
                            nodes={nodes}
                            links={edges}
                            directed={directed}
                            colors={colorMap}
                            mode={renderMode}
                        />
                    </div>
                    {/* 右侧 Sider 区域 */}
                    <div
                        style={{
                            width: "200px",
                            padding: "24px",
                            background: currentThemeToken.color2,
                        }}
                    >
                        Right Sider Content
                    </div>
                </div>
            </Content>
        </Layout>
    );
}

export default Cosmograph;
