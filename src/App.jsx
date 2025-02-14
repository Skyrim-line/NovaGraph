/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import createModule from "./graph";
import "./App.css";
import { GraphRenderer } from "./components/GraphRenderer";
import {
  Alert,
  Box,
  Collapse,
  Divider,
  ButtonGroup,
  IconButton,
  MenuItem,
  Snackbar,
  Tooltip,
  Typography,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "./components/Accordion";


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
import { ConfigProvider, Layout, Breadcrumb, Menu, Input, Drawer, Space, Form, Button, Modal, Select } from 'antd';
import { DarkMode, Brightness7 } from "@mui/icons-material";
import { ThemeContext } from './context/theme';  // 引入创建好的上下文
// import LeftSider from './pages/components/sider';
import { NodeIndexOutlined, MoreOutlined, TeamOutlined, PicCenterOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons';
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
            linkHoverColor: currentThemeToken.colorPrimary,
            lastItemColor: currentThemeToken.colorPrimary,
            separatorColor: currentThemeToken.colorText,
          },
          Modal: {
            contentBg: currentThemeToken.color2, // Modal整体背景色
            headerBg: currentThemeToken.color2, // Modal标题背景色
            titleColor: currentThemeToken.colorText, // Modal标题文字颜色
            footerBg: currentThemeToken.colorPrimary, // Modal底部背景色
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

          {/* 侧边菜单 */}

          <SideMenu isDarkMode={isDarkMode} searchTerm={searchTerm} onAlgorithmClick={handleAlgorithmClick} />
          <Modal
            title={selectedAlgorithm?.title || "Algorithm Details"}
            // bodyStyle={{ backgroundColor: isDarkMode ? "#1F1F1F" : "#fff" }} // 根据暗黑模式切换背景色

            open={drawerVisible}
            onCancel={() => setDrawerVisible(false)}
            footer={null}
            width={600}
          >
            {/* 左侧算法展示Sider
              */}

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
                        wasmFunction={wasmModule?.dijkstra_a_to_all}
                        postState={postAlgorithmState.bind(null, Algorithm.DIJKSTRA_A_TO_ALL)}
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

          <Box sx={{ display: "flex", gap: 1 }}>
            <Box>
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

            <Box width={{ xs: "15rem", sm: "20rem" }}>
              <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }} p={1}>
                <Tooltip title="Import Graph">
                  <Button
                    aria-controls="import-menu"
                    aria-haspopup="true"
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                    startIcon={<UploadIcon />}
                    variant="text"
                    color="secondary"
                    size="small"
                  >
                    Import
                  </Button>
                </Tooltip>
                <Tooltip title="Export Algorithm Data">
                  <Button
                    onClick={() => setExportOpen(true)}
                    startIcon={<FileDownloadIcon />}
                    variant="text"
                    color="secondary"
                    size="small"
                    disabled={activeResponse === null}
                  >
                    Export
                  </Button>
                </Tooltip>
                <Tooltip title="Help">
                  <IconButton
                    onClick={() => setHelpOpen(!helpOpen)}
                    color="secondary"
                  >
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
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
                <HelperCarousel
                  open={helpOpen}
                  handleClose={() => setHelpOpen(false)}
                />
              </Box>

              {/* PATH FINDING AND SEARCH ALGORITHMS (category: pfs) 
            
            */}
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleAccordianChange("panel1")}
              >
                <AccordionSummary aria-controls="panel1-content" id="panel1-header">
                  <Typography variant="body2" pl="5px">
                    Path Finding & Search
                  </Typography>
                </AccordionSummary>
                {/*
                  // TODO: Algorithm Part in left side 
                  */ }
                <AccordionDetails>
                  <ButtonGroup orientation="vertical" variant="text">
                    {Object.values(algorithmConfig)
                      .filter((alg) => alg.category === "pfs")
                      .map(
                        (alg, key) =>
                          alg.input_type === "default" && (
                            <AlgorithmInput
                              key={key}
                              wasmFunction={
                                wasmModule && wasmModule[alg.wasm_function_name]
                              }
                              postState={postAlgorithmState.bind(null, alg)}
                              setLoading={setLoading}
                              algorithmName={alg.button_text}
                              desc={alg.long_description_html}
                              nodes={nodes}
                              setHoveredAlgorithm={setHoveredAlgorithm}
                              hoveredAlgorithm={alg.hover_text_html}
                              inputs={alg.input_fields}
                            />
                          )
                      )}
                  </ButtonGroup>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel2"}
                onChange={handleAccordianChange("panel2")}
              >
                <AccordionSummary aria-controls="panel2-content" id="panel2-header">
                  <Typography variant="body2" pl="5px">
                    Centrality
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ButtonGroup orientation="vertical" variant="text">

                    <AlgorithmInput
                      wasmFunction={wasmModule && wasmModule.betweenness_centrality}
                      postState={postAlgorithmState.bind(
                        null,
                        Algorithm.BETWEENNESS_CENTRALITY
                      )}
                      setLoading={setLoading}
                      algorithmName="Betweenness Centrality"
                      desc={[
                        "Betweenness centrality measures the number of shortest paths that pass through a node.",
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.BETWEENNESS_CENTRALITY}
                      inputs={[]}
                    />
                    <AlgorithmInput
                      wasmFunction={wasmModule && wasmModule.closeness_centrality}
                      postState={postAlgorithmState.bind(
                        null,
                        Algorithm.CLOSENESS_CENTRALITY
                      )}
                      setLoading={setLoading}
                      algorithmName="Closeness Centrality"
                      desc={[
                        "Closeness centrality measures the average shortest path between a node and all other nodes.",
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.CLOSENESS_CENTRALITY}
                      inputs={[]}
                    />
                    <AlgorithmInput
                      wasmFunction={wasmModule && wasmModule.degree_centrality}
                      postState={postAlgorithmState.bind(
                        null,
                        Algorithm.DEGREE_CENTRALITY
                      )}
                      setLoading={setLoading}
                      algorithmName="Degree Centrality"
                      desc={[
                        "Degree centrality measures the number of edges connected to a node.",
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.DEGREE_CENTRALITY}
                      inputs={[]}
                    />
                    <AlgorithmInput
                      wasmFunction={wasmModule && wasmModule.eigenvector_centrality}
                      postState={postAlgorithmState.bind(
                        null,
                        Algorithm.EIGENVECTOR_CENTRALITY
                      )}
                      setLoading={setLoading}
                      algorithmName="Eigenvector Centrality"
                      desc={[
                        "Eigenvector centrality measures the influence of a node in a network.",
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.EIGENVECTOR_CENTRALITY}
                      inputs={[]}
                    />
                    <AlgorithmInput
                      wasmFunction={wasmModule && wasmModule.strength_centrality}
                      postState={postAlgorithmState.bind(
                        null,
                        Algorithm.STRENGTH_CENTRALITY
                      )}
                      setLoading={setLoading}
                      algorithmName="Node Strength"
                      desc={[
                        "Node strength measures the sum of the weights of the edges connected to a node.",
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.STRENGTH_CENTRALITY}
                      inputs={[]}
                    />
                    <AlgorithmInput
                      wasmFunction={wasmModule && wasmModule.harmonic_centrality}
                      postState={postAlgorithmState.bind(
                        null,
                        Algorithm.HARMONIC_CENTRALITY
                      )}
                      setLoading={setLoading}
                      algorithmName="Harmonic Centrality"
                      desc={[
                        "Harmonic centrality is a variant of closeness centrality that measures the average harmonic mean of the shortest paths between a node and all other nodes.",
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.HARMONIC_CENTRALITY}
                      inputs={[]}
                    />
                    <AlgorithmInput
                      wasmFunction={wasmModule && wasmModule.pagerank}
                      postState={postAlgorithmState.bind(null, Algorithm.PAGERANK)}
                      setLoading={setLoading}
                      algorithmName="Page Rank"
                      desc={[
                        "Page Rank is an algorithm that measures the importance of a node in a network.",
                        "Sergey Brin and Larry Page: The Anatomy of a Large-Scale Hypertextual Web Search Engine. Proceedings of the 7th World-Wide Web Conference, Brisbane, Australia, April 1998. https://doi.org/10.1016/S0169-7552(98)00110-X",
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.PAGERANK}
                      inputs={[
                        {
                          label: "Enter damping factor",
                          explanation: "The probability of following a link",
                          type: "number",
                          step: "0.01",
                          defaultValue: 0.85,
                        },
                      ]}
                    />
                  </ButtonGroup>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel3"}
                onChange={handleAccordianChange("panel3")}
              >
                <AccordionSummary aria-controls="panel3-content" id="panel3-header">
                  <Typography variant="body2" pl="5px">
                    Community Detection
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ButtonGroup orientation="vertical" variant="text">
                    <AlgorithmInput
                      wasmFunction={wasmModule && wasmModule.louvain}
                      postState={postAlgorithmState.bind(null, Algorithm.LOUVAIN)}
                      setLoading={setLoading}
                      algorithmName="Louvain Algorithm"
                      desc={[
                        "The Louvain algorithm uses a hierarchical approach to find communities in a network.",
                        "The resolution parameter determines the size of the communities. A higher resolution will result in smaller communities.",
                        "Blondel, V. D., Guillaume, J.-L., Lambiotte, R., & Lefebvre, E. (2008). Fast unfolding of communities in large networks. Journal of Statistical Mechanics: Theory and Experiment, 10008(10), 6. https://doi.org/10.1088/1742-5468/2008/10/P10008",
                        "Note: This algorithm cannot be performed on directed graphs.",
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.LOUVAIN}
                      inputs={[
                        {
                          label: "Enter resolution",
                          explanation:
                            "The resolution parameter (must be a positive number)",
                          type: "number",
                          step: "0.01",
                          defaultValue: 1.0,
                        },
                      ]}
                    />
                    <AlgorithmInput
                      wasmFunction={wasmModule && wasmModule.leiden}
                      postState={postAlgorithmState.bind(null, Algorithm.LEIDEN)}
                      setLoading={setLoading}
                      algorithmName="Leiden Algorithm"
                      desc={[
                        "The Leiden algorithm uses a hierarchical approach to find communities in a network.",
                        "The resolution parameter determines the size of the communities. A higher resolution will result in smaller communities.",
                        "Traag, V. A., Waltman, L., & van Eck, N. J. (2019). From Louvain to Leiden: guaranteeing well-connected communities. Scientific Reports, 9(1), 5233. https://doi.org/10.1038/s41598-019-41695-z",
                        "Note: This algorithm cannot be performed on directed graphs.",
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.LEIDEN}
                      inputs={[
                        {
                          label: "Enter resolution",
                          explanation: "The resolution parameter",
                          type: "number",
                          step: "0.01",
                          defaultValue: 0.25,
                        },
                      ]}
                    />
                    <AlgorithmInput
                      wasmFunction={wasmModule && wasmModule.fast_greedy}
                      postState={postAlgorithmState.bind(
                        null,
                        Algorithm.FAST_GREEDY
                      )}
                      setLoading={setLoading}
                      algorithmName="Fast-Greedy Algorithm"
                      desc={[
                        "The Fast-Greedy algorithm uses the fast greedy modularity optimisation to find communities in a network.",
                        "Clauset, A., Newman, M. E. J., & Moore, C. (2004). Finding community structure in very large networks. Physical Review E, 70(6), 066111. https://doi.org/10.1103/PhysRevE.70.066111",
                        "Note: This algorithm cannot be performed on directed graphs.",
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.FAST_GREEDY}
                      inputs={[]}
                    />
                    <AlgorithmInput
                      wasmFunction={wasmModule && wasmModule.label_propagation}
                      postState={postAlgorithmState.bind(
                        null,
                        Algorithm.LABEL_PROPAGATION
                      )}
                      setLoading={setLoading}
                      algorithmName="Label Propagation"
                      desc={[
                        "The Label Propagation algorithm is a simple community detection algorithm that assigns nodes to communities based on their labels. In the event of a tie, the algorithm will randomly assign a label.",
                        "Due to the randomness of the algorithm, the results may vary between runs.",
                        "This version extends the original algorithm to take edge weights into account.",
                        "Raghavan, U. N., Albert, R., & Kumara, S. (2007). Near linear time algorithm to detect community structures in large-scale networks. Physical Review E, 76(3), 036106. https://doi.org/10.1103/PhysRevE.76.036106",
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.LABEL_PROPAGATION}
                      inputs={[]}
                    />
                    <AlgorithmInput
                      wasmFunction={
                        wasmModule && wasmModule.local_clustering_coefficient
                      }
                      postState={postAlgorithmState.bind(
                        null,
                        Algorithm.LOCAL_CLUSTERING_COEFFICIENT
                      )}
                      setLoading={setLoading}
                      algorithmName="Local Clustering Coefficient"
                      desc={[
                        "The local clustering coefficient measures the number of triangles that pass through a node.",
                        "Any nodes with a clustering coefficient of 0 are not part of any triangles.",
                        "D. J. Watts and S. Strogatz: Collective dynamics of small-world networks. Nature 393(6684):440-442 (1998)",
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.LOCAL_CLUSTERING_COEFFICIENT}
                      inputs={[]}
                    />
                    <AlgorithmInput
                      wasmFunction={wasmModule && wasmModule.k_core}
                      postState={postAlgorithmState.bind(null, Algorithm.K_CORE)}
                      setLoading={setLoading}
                      algorithmName="K-Core Decomposition"
                      desc={[
                        "The k-core decomposition algorithm finds the k-core of a graph.",
                        "The k-core is a subgraph in which all nodes have a degree (number of outgoing edges) of at least k.",
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.K_CORE}
                      inputs={[
                        {
                          label: "Enter k",
                          explanation: "The minimum degree of the k-core",
                          type: "number",
                          step: "1",
                          defaultValue: 1,
                        },
                      ]}
                    />
                    <AlgorithmInput
                      wasmFunction={wasmModule && wasmModule.triangle_count}
                      postState={postAlgorithmState.bind(
                        null,
                        Algorithm.TRIANGLE_COUNT
                      )}
                      setLoading={setLoading}
                      algorithmName="Triangle Count"
                      desc={[
                        "The triangle count algorithm counts the number of triangles (groups of 3 connected nodes) in a graph.",
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.TRIANGLE_COUNT}
                      inputs={[]}
                    />
                    <AlgorithmInput
                      wasmFunction={
                        wasmModule && wasmModule.strongly_connected_components
                      }
                      postState={postAlgorithmState.bind(
                        null,
                        Algorithm.STRONGLY_CONNECTED_COMPONENTS
                      )}
                      setLoading={setLoading}
                      algorithmName="Strongly Connected Components"
                      buttonLabel="Strongly Connected (SCC)"
                      desc={[
                        "This algorithm finds the strongly connected components in a graph.",
                        "For undirected graphs, this algorithm will return all connected components.",
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.STRONGLY_CONNECTED_COMPONENTS}
                      inputs={[]}
                    />
                    <AlgorithmInput
                      wasmFunction={
                        wasmModule && wasmModule.weakly_connected_components
                      }
                      postState={postAlgorithmState.bind(
                        null,
                        Algorithm.WEAKLY_CONNECTED_COMPONENTS
                      )}
                      setLoading={setLoading}
                      algorithmName="Weakly Connected Components"
                      buttonLabel="Weakly Connected (WCC)"
                      desc={[
                        "This algorithm finds the weakly connected components in a directed graph.",
                        "Note: This algorithm can only be performed on directed graphs.",
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.WEAKLY_CONNECTED_COMPONENTS}
                      inputs={[]}
                    />
                  </ButtonGroup>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expanded === "panel4"}
                onChange={handleAccordianChange("panel4")}
              >
                <AccordionSummary aria-controls="panel4-content" id="panel4-header">
                  <Typography variant="body2" pl="5px">
                    Other Algorithms
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ButtonGroup orientation="vertical" variant="text">
                    <AlgorithmInput
                      wasmFunction={wasmModule && wasmModule.vertices_are_adjacent}
                      postState={postAlgorithmState.bind(
                        null,
                        Algorithm.NEIGHBOR_JOINING
                      )}
                      setLoading={setLoading}
                      algorithmName="Check Adjacency"
                      desc={[
                        "This algorithm checks to see if two nodes are connected by a single edge.",
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.NEIGHBOR_JOINING}
                      inputs={[
                        {
                          label: "Enter source vertex",
                          explanation: "Select the source vertex",
                          type: "text",
                        },
                        {
                          label: "Enter target vertex",
                          explanation: "Select the target vertex",
                          type: "text",
                        },
                      ]}
                    />
                    <AlgorithmMultiInput
                      wasmFunction={wasmModule && wasmModule.jaccard_similarity}
                      postState={postAlgorithmState.bind(
                        null,
                        Algorithm.JACCARD_SIMILARITY
                      )}
                      setLoading={setLoading}
                      algorithmName="Jaccard Similarity"
                      desc={[
                        "The Jaccard similarity algorithm measures the similarity between two sets of nodes. Enter at least 2 nodes to compare.",
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.JACCARD_SIMILARITY}
                    />
                    <AlgorithmInput
                      wasmFunction={wasmModule && wasmModule.topological_sort}
                      postState={postAlgorithmState.bind(
                        null,
                        Algorithm.TOPOLOGICAL_SORT
                      )}
                      setLoading={setLoading}
                      algorithmName="Topological Sort"
                      desc={[
                        "The topological sort algorithm arranges the nodes in a directed acyclic graph in a linear order.",
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.TOPOLOGICAL_SORT}
                      inputs={[]}
                    />
                    <AlgorithmInput
                      wasmFunction={wasmModule && wasmModule.diameter}
                      postState={postAlgorithmState.bind(null, Algorithm.DIAMETER)}
                      setLoading={setLoading}
                      algorithmName="Graph Diameter"
                      desc={[
                        "The graph diameter algorithm calculates the longest shortest path between any two nodes.",
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.DIAMETER}
                      inputs={[]}
                    />
                    <AlgorithmInput
                      wasmFunction={wasmModule && wasmModule.eulerian_path}
                      postState={postAlgorithmState.bind(
                        null,
                        Algorithm.EULERIAN_PATH
                      )}
                      setLoading={setLoading}
                      algorithmName="Eulerian Path"
                      desc={[
                        "The Eulerian path algorithm finds a path that visits every edge exactly once.",
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.EULERIAN_PATH}
                      inputs={[]}
                    />
                    <AlgorithmInput
                      wasmFunction={wasmModule && wasmModule.eulerian_circuit}
                      postState={postAlgorithmState.bind(
                        null,
                        Algorithm.EULERIAN_CIRCUIT
                      )}
                      setLoading={setLoading}
                      algorithmName="Eulerian Circuit"
                      desc={[
                        "The Eulerian circuit (or Eulerian cycle) algorithm finds a path that visits every edge exactly once and returns to the starting node.",
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.EULERIAN_CIRCUIT}
                      inputs={[]}
                    />
                    <AlgorithmInput
                      wasmFunction={
                        wasmModule && wasmModule.missing_edge_prediction
                      }
                      postState={postAlgorithmState.bind(
                        null,
                        Algorithm.MISSING_EDGE_PREDICTION
                      )}
                      setLoading={setLoading}
                      algorithmName="Missing Edge Prediction"
                      desc={[
                        "The missing edge prediction algorithm predicts missing edges in a graph. It fits a Hierarchical Random Graph (HRG) model to the graph and predicts missing edges based on the model.",
                        "A. Clauset, C. Moore, and M.E.J. Newman. Hierarchical structure and the prediction of missing links in networks. Nature 453, 98 - 101 (2008)",
                        `For a ${missingEdgeDefaults.graphSize} sized graph, this uses the default values of ${missingEdgeDefaults.numSamples} samples and ${missingEdgeDefaults.numBins} bins.`,
                      ]}
                      nodes={nodes}
                      setHoveredAlgorithm={setHoveredAlgorithm}
                      hoveredAlgorithm={Algorithm.MISSING_EDGE_PREDICTION}
                      inputs={[
                        {
                          label: "Enter Sample Size",
                          explanation:
                            "How many times missing edges are predicted (accuracy)",
                          type: "number",
                          step: "1",
                          defaultValue: missingEdgeDefaults.numSamples,
                        },
                        {
                          label: "Enter Bin Size",
                          explanation:
                            "Number of bins for the histogram model (precision)",
                          type: "number",
                          step: "1",
                          defaultValue: missingEdgeDefaults.numBins,
                        },
                      ]}
                    />
                  </ButtonGroup>
                </AccordionDetails>
              </Accordion>
              <AlgorithmExplanation text={hoveredAlgorithm} />
            </Box>
          </Box>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
