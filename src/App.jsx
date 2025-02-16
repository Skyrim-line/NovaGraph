/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import createModule from "./graph";
import "./App.css";
import { GraphRenderer } from "./components/GraphRenderer";
import {

  Box,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import ImportMenu from "./components/imports/ImportMenu";
import { Algorithm } from "./algorithms";
import { algorithmConfig } from "./algorithm-config";
import AlgorithmExplanation from "./components/AlgorithmExplanation";
import { ErasBold, ErasMedium } from "./components/Eras";
import AlgorithmOutput from "./components/algorithmOutputs/AlgorithmOutput";
import AlgorithmInput from "./components/AlgorithmInput";
import { SpinnerDotted } from "spinners-react";
import AlgorithmMultiInput from "./components/AlgorithmMultiInput";
import ExportMenu from "./components/ExportMenu";
import HelperCarousel from "./components/HelperCarousel";

// 下面的是demo界面的主体代码
import { useContext } from 'react';
import { ConfigProvider, Layout, Breadcrumb, Menu, Input, Drawer, Flex, Form, Button, Modal, Select } from 'antd';
import { DarkMode, Brightness7 } from "@mui/icons-material";
import { ThemeContext } from './context/theme';  // 引入创建好的上下文
// import LeftSider from './pages/components/sider';
import { NodeIndexOutlined, MoreOutlined, TeamOutlined, PicCenterOutlined, SearchOutlined, ImportOutlined, ExportOutlined, CloseOutlined } from '@ant-design/icons';
const { Search } = Input;
const { Header, Sider } = Layout;
const { Option } = Select;



// TODO: 左侧菜单栏算法输入
const SideMenu = ({ isDarkMode, searchTerm, onAlgorithmClick }) => {
  const [openKeys, setOpenKeys] = useState([]);

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  // 定义菜单数据（算法）
  const menuData = [
    {
      key: "pfs",
      icon: <NodeIndexOutlined />,
      title: "Path Finding & Search",
      children: [
        { key: "AtoB", title: "Dijkstra(A to B)" },
        { key: "AtoAll", title: "Dijkstra(A to ALl)" },
        { key: "bfs", title: "Breadth-First Search" },
      ],
    },
    {
      key: "centrality",
      icon: <PicCenterOutlined />,
      title: "Centrality",
      children: [
        { key: "degree", title: "Degree Centrality" },
        { key: "closeness", title: "Closeness Centrality" },
        { key: "betweenness", title: "Betweenness Centrality" },
      ],
    },
    {
      key: "community",
      icon: <TeamOutlined />,
      title: "Community Detection",
      children: [
        { key: "louvain", title: "Louvain Method" },
        { key: "girvan", title: "Girvan-Newman Algorithm" },
      ],
    },
    { key: "other", icon: <MoreOutlined />, title: "Other Algorithms" },
  ];

  // 过滤搜索
  const filteredMenu = menuData
    .map((category) => ({
      ...category,
      children: category.children?.filter((alg) =>
        alg.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.children?.length || category.title.toLowerCase().includes(searchTerm.toLowerCase()));

  // 渲染菜单
  const renderMenuItems = (menu) =>
    menu.map((item) => {
      if (item.children) {
        return (
          <Menu.SubMenu key={item.key} icon={item.icon} title={item.title}>
            {renderMenuItems(item.children)}
          </Menu.SubMenu>
        );
      }
      return (
        <Menu.Item key={item.key} onClick={() => onAlgorithmClick(item)}>
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


function App() {
  const [wasmModule, setWasmModule] = useState();
  const [expanded, setExpanded] = useState("panel1");

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [existingEdges, setExistingEdges] = useState([]); // for missing edge prediction
  const [tempEdges, setTempEdges] = useState([]); // for adding edges
  const [directed, setDirected] = useState(false);
  const [colorMap, setColorMap] = useState({});
  const [sizeMap, setSizeMap] = useState({});
  const [renderMode, setRenderMode] = useState(1);
  const [activeAlgorithm, setActiveAlgorithm] = useState(null);
  const [activeResponse, setActiveResponse] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [hoveredAlgorithm, setHoveredAlgorithm] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const [missingEdgeDefaults, setMissingEdgeDefaults] = useState({});

  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState(""); // 搜索框输入状态
  const [drawerVisible, setDrawerVisible] = useState(false); // 控制Drawer可见性
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null); // 选中的算法信息




  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAlgorithmClick = (algorithm) => {
    setSelectedAlgorithm(algorithm);
    setDrawerVisible(true);
  };

  useEffect(() => {
    createModule().then((mod) => {
      setWasmModule(mod);
      const graph = mod.initGraph(); // initialize the graph in C++
      setNodes(graph.nodes);
      setEdges(graph.edges);
      setExistingEdges(graph.edges);
      setMissingEdgeDefaults(mod.missing_edge_prediction_default_values());

      window.onerror = (message, source, lineno, colno, error) => {
        setLoading(null);
        if (typeof error != "number") return;
        const pointer = error;
        const error_message = mod.what_to_stderr(pointer);
        setError(error_message);
      };

      window.onunload = () => {
        console.log("Cleanup");
        mod.cleanupGraph();
      };
    });
  }, []);

  useEffect(() => {
    console.log("colors");
    console.log(colorMap);
    console.log("missing edge defaults");
    console.log(missingEdgeDefaults);
  }, [colorMap]);

  useEffect(() => {
    if (tempEdges.length > 0) {
      setEdges([...edges, ...tempEdges]);
    } else {
      setEdges(existingEdges);
    }
  }, [tempEdges]);

  const updateGraph = (nodes, edges, directed) => {
    setColorMap({});
    setSizeMap({});
    setActiveAlgorithm(null);
    setNodes(nodes);
    setEdges(edges);
    setExistingEdges(edges);
    setDirected(directed);
    setRenderMode(1);
    setLoading(null);
    setMissingEdgeDefaults(wasmModule.missing_edge_prediction_default_values());
  };

  const handleAccordianChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const postAlgorithmState = (alg, response) => {
    if (response.colorMap) {
      setSizeMap(response.sizeMap ? response.sizeMap : {});
      setColorMap(response.colorMap);
    } else if (response.sizeMap) {
      setSizeMap(response.sizeMap);
      setColorMap({});
    } else {
      setColorMap({});
      setSizeMap({});
    }
    setTempEdges(response.edges ? response.edges : []);
    setRenderMode(response.mode);
    setActiveAlgorithm(alg);
    setActiveResponse(response);
    setLoading(null);
  };
  // 下面是demo 界面的主体代码和结构
  // TODO: Demo 界面原先layout
  const [collapsed, setCollapsed] = useState(false);
  const { isDarkMode, setIsDarkMode, currentThemeToken } = useContext(ThemeContext);


  return (
    <ConfigProvider
      theme={{
        token: currentThemeToken, // 使用自定义主题 token
        components: {
          Breadcrumb: {
            separatorMargin: '20px',
            linkColor: currentThemeToken.colorText,
            // linkHoverColor: currentThemeToken.colorPrimary,
            lastItemColor: currentThemeToken.colorHeader,
            separatorColor: currentThemeToken.colorText,
          },
          Modal: {
            contentBg: currentThemeToken.color2, // Modal整体背景色
            headerBg: currentThemeToken.color2, // Modal标题背景色
            titleColor: currentThemeToken.colorText, // Modal标题文字颜色
            footerBg: currentThemeToken.colorPrimary, // Modal底部背景色
          },
          Input: {
            activeBorderColor: currentThemeToken.color2, // 边框选中时颜色
            hoverBorderColor: currentThemeToken.color2, // 边框hover颜色
            borderColor: currentThemeToken.color2, // 默认边框颜色
            colorBgContainer: currentThemeToken.color2, // 输入框背景色
            colorText: currentThemeToken.colorText, // 输入框文字颜色
            colorPlaceholder: currentThemeToken.colorPlaceholder, // Placeholder 文字颜色
          },

        }
      }}
    >
      {loading && (
        <div className="loader-container">
          <SpinnerDotted size={100} thickness={150} color="#6750C6" />
          <p className="loading-text">{loading}</p>
        </div>
      )}

      <Layout style={{ minHeight: '100vh' }}>


        <Sider
          width={350}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          theme={isDarkMode ? "dark" : "light"}
        >
          {/* Logo */}
          <a href="/app">
            <div className="font-logo" style={{ color: isDarkMode ? "#fff" : "#000", padding: "10px" }}>
              {collapsed ? (
                <span style={{ fontFamily: "ITC Eras Demi" }}>N</span>
              ) : (
                <>
                  <span style={{ fontFamily: "ITC Eras Book" }}>Nova</span>
                  <span style={{ fontFamily: "ITC Eras Demi" }}>graph</span>
                </>
              )}
            </div>
          </a>

          {/* 搜索框 */}
          <div style={{ padding: "10px" }}>
            {collapsed ? (
              <SearchOutlined
                onClick={() => setCollapsed(false)}
                style={{
                  fontSize: "20px",
                  cursor: "pointer",
                  marginLeft: "20px",

                }}
                wasmModule={wasmModule}
              />
            ) : (
              <Search
                placeholder="Search Algorithms Here"
                onChange={handleSearch}
                allowClear
                enterButton
                style={{
                  width: "100%",

                }}
              />
            )}
          </div>
          <Flex vertical gap="small" style={{ padding: "10px" }}>
            {collapsed ? (
              <Tooltip title="Import Graph">

                <Button
                  shape="circle"
                  icon={<ImportOutlined />}
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                  style={{
                    backgroundColor: currentThemeToken.colorButton,
                    width: "30px",
                    height: "30px",
                    lineHeight: "30px", // 确保垂直居中
                    display: 'flex',
                    justifyContent: 'center',
                    marginLeft: "15px",
                    border: "none",
                  }}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Import Graph">

                <Button
                  icon={<ImportOutlined />}
                  aria-controls="import-menu"
                  aria-haspopup="true"
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                  startIcon={<UploadIcon />}
                  block
                  style={{
                    backgroundColor: currentThemeToken.colorButton, // 按钮背景色
                    border: "none",
                  }}
                >
                  Import Graph
                </Button>
              </Tooltip>
            )}
            {collapsed ? (
              <Tooltip title="Export Algorithm Data">
                <Button
                  shape="circle"
                  icon={<ExportOutlined />}
                  onClick={() => setExportOpen(true)}
                  startIcon={<FileDownloadIcon />}
                  style={{
                    backgroundColor: currentThemeToken.colorButton,
                    border: "none",
                    width: "30px",
                    height: "30px",
                    lineHeight: "30px", // 确保垂直居中
                    display: 'flex',
                    justifyContent: 'center',
                    marginLeft: "15px",
                  }}

                  disabled={activeResponse === null}
                >
                </Button>
              </Tooltip>
            ) : (
              <Tooltip title="Export Algorithm Data">
                <Button
                  icon={<ExportOutlined />}
                  onClick={() => setExportOpen(true)}
                  startIcon={<FileDownloadIcon />}
                  style={{
                    backgroundColor: currentThemeToken.colorButton, // 按钮背景色
                    border: "none",
                  }}
                  block
                  disabled={activeResponse === null}
                >
                  Export Algorithm Data
                </Button>
              </Tooltip>
            )
            }

            <ImportMenu
              id="import-menu"
              anchorEl={anchorEl}
              setAnchorEl={setAnchorEl}
              module={wasmModule}
              updateGraph={updateGraph}
              setLoading={setLoading}
            />
            <ExportMenu
              open={exportOpen}
              setOpen={setExportOpen}
              data={activeResponse && activeResponse.data}
            />
          </Flex>

          {/* 侧边菜单 */}

          <SideMenu isDarkMode={isDarkMode} searchTerm={searchTerm} onAlgorithmClick={handleAlgorithmClick} />
          <Modal
            title={selectedAlgorithm?.title || "Algorithm Details"}
            open={drawerVisible}
            onCancel={() => setDrawerVisible(false)}
            footer={null}
            width={600}
            closeIcon={
              <CloseOutlined style={{ color: isDarkMode ? '#ffffff' : '#000000' }} />
            }
          >
            {selectedAlgorithm ? (
              (() => {
                switch (selectedAlgorithm.key) {
                  case "AtoB":
                    return (

                      <AlgorithmInput
                        wasmFunction={wasmModule && wasmModule[algorithmConfig.DIJKSTRA_A_TO_B.wasm_function_name]}
                        postState={postAlgorithmState.bind(null, Algorithm.DIJKSTRA_A_TO_B)}
                        setLoading={setLoading}
                        algorithmName="Dijkstra (A to B)"
                        desc={["Find the shortest path from node A to node B."]}
                        nodes={nodes}
                        setHoveredAlgorithm={setHoveredAlgorithm}
                        // hoveredAlgorithm={Algorithm.DIJKSTRA_A_TO_B}
                        inputs={[
                          { label: "Start Node", type: "node" },
                          { label: "End Node", type: "node" },
                        ]}
                      />
                    );
                  case "AtoAll":
                    return (
                      <AlgorithmInput
                        wasmFunction={wasmModule && wasmModule[algorithmConfig.DIJKSTRA_A_TO_ALL.wasm_function_name]}
                        postState={postAlgorithmState.bind(null, Algorithm.DIJKSTRA_ALL)}
                        setLoading={setLoading}
                        algorithmName="Dijkstra (A to All)"
                        desc={["Find the shortest path from node A to all other nodes."]}
                        nodes={nodes}
                        setHoveredAlgorithm={setHoveredAlgorithm}
                        hoveredAlgorithm={Algorithm.DIJKSTRA_A_TO_ALL}
                        inputs={[
                          { label: "Start Node", type: "node" },
                        ]}
                      />
                    );
                  case "bfs":
                    return (
                      <AlgorithmInput
                        wasmFunction={wasmModule?.bfs}
                        postState={postAlgorithmState.bind(null, Algorithm.BFS)}
                        setLoading={setLoading}
                        algorithmName="Breadth-First Search"
                        desc={["Traverse the graph using BFS starting from a node."]}
                        nodes={nodes}
                        setHoveredAlgorithm={setHoveredAlgorithm}
                        hoveredAlgorithm={Algorithm.BFS}
                        inputs={[
                          { label: "Start Node", type: "node" },
                        ]}
                      />
                    );
                  case "degree":
                    return (
                      <AlgorithmInput
                        wasmFunction={wasmModule?.degree_centrality}
                        postState={postAlgorithmState.bind(null, Algorithm.DEGREE_CENTRALITY)}
                        setLoading={setLoading}
                        algorithmName="Degree Centrality"
                        desc={["Degree centrality measures the number of edges connected to a node."]}
                        nodes={nodes}
                        setHoveredAlgorithm={setHoveredAlgorithm}
                        hoveredAlgorithm={Algorithm.DEGREE_CENTRALITY}
                        inputs={[]}
                      />
                    );
                  case "closeness":
                    return (
                      <AlgorithmInput
                        wasmFunction={wasmModule?.closeness_centrality}
                        postState={postAlgorithmState.bind(null, Algorithm.CLOSENESS_CENTRALITY)}
                        setLoading={setLoading}
                        algorithmName="Closeness Centrality"
                        desc={["Closeness centrality measures how close a node is to all other nodes."]}
                        nodes={nodes}
                        setHoveredAlgorithm={setHoveredAlgorithm}
                        hoveredAlgorithm={Algorithm.CLOSENESS_CENTRALITY}
                        inputs={[]}
                      />
                    );
                  case "betweenness":
                    return (
                      <AlgorithmInput
                        wasmFunction={wasmModule?.betweenness_centrality}
                        postState={postAlgorithmState.bind(null, Algorithm.BETWEENNESS_CENTRALITY)}
                        setLoading={setLoading}
                        algorithmName="Betweenness Centrality"
                        desc={["Betweenness centrality measures how often a node is on the shortest path between other nodes."]}
                        nodes={nodes}
                        setHoveredAlgorithm={setHoveredAlgorithm}
                        hoveredAlgorithm={Algorithm.BETWEENNESS_CENTRALITY}
                        inputs={[]}
                      />
                    );
                  case "louvain":
                    return (
                      <AlgorithmInput
                        wasmFunction={wasmModule?.louvain_method}
                        postState={postAlgorithmState.bind(null, Algorithm.LOUVAIN)}
                        setLoading={setLoading}
                        algorithmName="Louvain Method"
                        desc={["Detects communities in the graph using modularity optimization."]}
                        nodes={nodes}
                        setHoveredAlgorithm={setHoveredAlgorithm}
                        hoveredAlgorithm={Algorithm.LOUVAIN}
                        inputs={[]}
                      />
                    );
                  case "girvan":
                    return (
                      <AlgorithmInput
                        wasmFunction={wasmModule?.girvan_newman}
                        postState={postAlgorithmState.bind(null, Algorithm.GIRVAN_NEWMAN)}
                        setLoading={setLoading}
                        algorithmName="Girvan-Newman Algorithm"
                        desc={["Detects communities in the graph by progressively removing edges."]}
                        nodes={nodes}
                        setHoveredAlgorithm={setHoveredAlgorithm}
                        hoveredAlgorithm={Algorithm.GIRVAN_NEWMAN}
                        inputs={[]}
                      />
                    );
                  default:
                    return (
                      <Typography.Text style={{ color: currentThemeToken.colorText }}>
                        Please select an algorithm to view its details.
                      </Typography.Text>
                    );
                }
              })()
            ) : (
              <Typography.Text style={{ color: currentThemeToken.colorText }}>
                Please select an algorithm to view its details.
              </Typography.Text>
            )}
          </Modal>
        </Sider>
        <Layout style={{ minHeight: '100vh' }}>
          <Header
            className='header'
            style={{
              background: currentThemeToken.color3,
            }}
          >
            <Breadcrumb
              className="title"
              items={[
                {
                  title: <a href="/">Home</a>,
                },
                {
                  title: 'Algorithm Demo',
                },
              ]}
            />
            <div className="user-guide">
              <a href="/user-guide" className="user-guide" >User Guide</a>
              <IconButton
                sx={{
                  color: isDarkMode ? "#FFD700" : "#000", // 设置图标颜色
                  transition: "color 0.3s, transform 0.3s",
                  "&:hover": {
                    color: isDarkMode ? "#FFF" : "#555",
                    transform: "scale(1.1)",
                  },
                }}
                onClick={() => setIsDarkMode(prev => !prev)}
                aria-label="toggle dark mode"
              >
                {isDarkMode
                  ? <Brightness7 sx={{ fontSize: "30px" }} />
                  : <DarkMode sx={{ fontSize: "30px" }} />}
              </IconButton>
            </div>
          </Header>

          <Box sx={{ display: "flex" }}>

            <GraphRenderer
              nodes={nodes}
              links={edges}
              directed={directed}
              colors={colorMap}
              sizes={sizeMap}
              mode={renderMode}
            />
            <AlgorithmOutput
              algorithm={activeAlgorithm}
              response={activeResponse}

            />
          </Box>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
