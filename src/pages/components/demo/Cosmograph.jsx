import { Layout } from 'antd';
const { Content } = Layout;

function Cosmograph() {
    return (
        <Layout>
            <Content >
                <div style={{ padding: 24, background: currentThemeToken.color2 }}>
                    Search Box
                </div>
                {/* 主内容区域和右侧 Sider 使用 flex 布局 */}
                <div
                    style={{
                        display: 'flex',
                        background: currentThemeToken.colorBgContainer,
                        minHeight: '100vh',
                    }}
                >
                    {/* 左侧主内容区域 */}
                    <div
                        style={{
                            flex: 1,
                            padding: '24px',
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
                            width: '200px',
                            padding: '24px',
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