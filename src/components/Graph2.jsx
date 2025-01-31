/* eslint-disable no-unused-vars */
import { Cosmograph, CosmographProvider, CosmographSearch } from '@cosmograph/react'
import { useRef, useCallback, useEffect, useState, useContext } from 'react';
import chroma from "chroma-js";
import { Layout } from "antd";
import { ThemeContext } from "../context/theme"; // 引入主题上下文
import { GraphRenderer } from "./GraphRenderer"; // 示例：你的图渲染组件
import {
    Settings as SettingsIcon,
    Pause as PauseIcon,
    PlayArrow as PlayArrowIcon,
    Replay as ReplayIcon,
    ZoomOutMap as ZoomOutMapIcon,
    ZoomIn as ZoomInIcon,
    ZoomOut as ZoomOutIcon,
    LabelOutlined as LabelOutlinedIcon,
    LabelOff as LabelOffIcon,
    Margin,
} from "@mui/icons-material";
import { Mode } from '../renderModes';
import { GraphContext } from '../context/GraphUpdate';
import { ErasBold, ErasMedium } from './Eras';
import { Box, Button, Divider, Drawer, FormControlLabel, IconButton, RadioGroup, Radio, Tooltip, Typography } from '@mui/material';


const { Content } = Layout;

function Graph({ colors, sizes, nodes, links, directed, mode }) {
    // 从 ThemeContext 中获取当前主题 token（暗/亮模式对映的颜色等）
    const { currentThemeToken } = useContext(ThemeContext);
    const cosmograph = useRef()
    const scale = chroma.scale(['#e4c1ff', '#6750C6']);
    const error = '#F05480'
    const neutral = '#9f8fc3'
    const contrast_green = '#67baa7'
    const out_of_focus = '#332d48'
    /* Palette: https://mycolor.space/?hex=%236750C6&sub=1 (Spot Palette)
        - Dark: #6750c6
        - Default: #9f8fc3
        - Light: #f7ebff
        - Contrast (Green): #67baa7
    */

    const [selectedNode, setSelectedNode] = useState(null);
    const [dynamicLabels, setDynamicLabels] = useState(true);
    const [optionsDrawer, setOptionsDrawer] = useState(false);

    const [gravity, setGravity] = useState(0);
    const [nodeSizeScale, setNodeSizeScale] = useState(1);

    useEffect(() => {
        console.log('Restarting graph...')
        cosmograph.current?.create();
        cosmograph.current?.fitView();
    }, [nodes, links, directed])

    const zoomOut = () => {
        cosmograph.current?.unselectNodes();
        cosmograph.current?.fitView(500);
        setSelectedNode(null);
    }

    const zoomToNode = useCallback((node, i) => {
        if (node && i != undefined && node != selectedNode) {
            cosmograph.current?.selectNode(node);
            cosmograph.current?.zoomToNode(node);
            setSelectedNode(node);
        } else {
            zoomOut();
        }
    });

    const zoomGraphOut = () => {
        const zoomLevel = cosmograph.current?.getZoomLevel();
        if (zoomLevel <= 1) {
            cosmograph.current?.setZoomLevel(0.1, 500);
        } else {
            cosmograph.current?.setZoomLevel(zoomLevel - 1, 500);
        }
    }

    const zoomGraphIn = () => {
        const zoomLevel = cosmograph.current?.getZoomLevel();
        cosmograph.current?.setZoomLevel(zoomLevel + 1, 500);
    }


    const getColor = value => {
        switch (mode) {
            case Mode.COLOR_IMPORTANT:
                return value > 0 ? scale(1).hex() : (value < 0 ? error : neutral);
            case Mode.COLOR_SHADE_DEFAULT:
                return isNaN(value) ? out_of_focus : scale(value).hex();
            case Mode.COLOR_SHADE_ERROR:
                return isNaN(value) ? error : scale(value).hex();
            case Mode.SIZE_SCALAR:
                return neutral;
            case Mode.RAINBOW:
                return `hsl(${(value * 137.508) + 50},100%,75%)`;
            default:
                return neutral
        }
    }

    const getSize = id => {
        if (mode === Mode.COLOR_SHADE_DEFAULT && isNaN(colors[id])) {
            return 5
        }
        return sizes[id] ? sizes[id] : 20
    }

    const getLinkColor = link => {
        if (colors[`${link.source}-${link.target}`] > 0) {
            return contrast_green
        } else if (!directed && colors[`${link.target}-${link.source}`] > 0) {
            return contrast_green
        } else if (colors[`${link.target}-${link.source}`] === 0) {
            return scale(1).hex()
        } else if (!directed && colors[`${link.source}-${link.target}`] === 0) {
            return scale(1).hex()
        } else {
            return null
        }
    }

    const getLinkWidth = link => {
        if (colors[`${link.source}-${link.target}`] >= 0) {
            return 3
        } else if (!directed && colors[`${link.target}-${link.source}`] >= 0) {
            return 3
        } else {
            return 0.1
        }
    }

    return (
        <Layout>
            <CosmographProvider nodes={nodes} links={links}>
                <Content>

                    <CosmographSearch
                        onSelectResult={n => cosmograph.current?.selectNode(n)}
                        accessors={[
                            { label: 'Name', accessor: n => n.name },
                            { label: 'ID', accessor: n => n.id }
                        ]}
                        style={{
                            backgroundColor: "#222222", // 或任意颜色
                            color: "#ffffff",           // 改变文字颜色
                            padding: "0 1.5rem"

                            // 其他自定义样式
                        }}


                    />

                    {/* 主内容区域和右侧 Sider 使用 flex 布局 */}
                    <div
                        style={{
                            display: "flex",
                            background: currentThemeToken.colorBgContainer,
                            minHeight: "100vh",
                        }}
                    >
                        {/* 中间主内容区域 */}
                        <div
                            style={{
                                flex: 1,
                                padding: "24px",
                                background: currentThemeToken.color3,
                            }}
                        >
                            <Cosmograph
                                style={{ backgroundColor: "#222", flex: 1 }}
                                ref={cosmograph}
                                initialZoomLevel={1}
                                disableSimulation={false}

                                nodeSize={(_node, id) => getSize(id)}
                                nodeColor={(_node, id) => getColor(colors[id])}
                                linkColor={link => getLinkColor(link)}
                                nodeGreyoutOpacity={0.1}
                                linkWidth={link => getLinkWidth(link)}

                                nodeLabelAccessor={(node) => node.name ? node.name : node.id}
                                linkArrows={directed}
                                showDynamicLabels={dynamicLabels}

                                renderHoveredNodeRing={true}
                                hoveredNodeRingColor={contrast_green}

                                linkGreyoutOpacity={0}
                                simulationLinkSpring={0.01}
                                simulationDecay={100000}

                                nodeSizeScale={nodeSizeScale}
                                simulationRepulsion={2}
                                simulationGravity={gravity}
                                simulationLinkDistance={20}

                                onClick={zoomToNode}
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
                            Graph Options
                        </div>
                    </div>
                </Content>
            </CosmographProvider>
        </Layout>
    );
}

export default Graph;
