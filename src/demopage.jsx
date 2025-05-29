/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import createModule from "./graph";
import "./App.css";
import logo from "./pages/image/logo_only.svg";
import { GraphRenderer } from "./components/GraphRenderer";
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import ImportMenu from "./components/imports/ImportMenu";
import { Algorithm } from "./algorithms";
import { algorithmConfig } from "./algorithm-config";
import AlgorithmOutput from "./components/algorithmOutputs/AlgorithmOutput";
import AlgorithmInput from "./components/AlgorithmInput";
import { SpinnerDotted } from "spinners-react";
import ExportMenu from "./components/ExportMenu";

// 下面的是demo界面的主体代码
import { useContext } from "react";
import {
  ConfigProvider,
  Layout,
  Menu,
  Input,
  Flex,
  Form,
  Button,
  Modal,
  Select,
  Divider,
} from "antd";
import { ThemeContext } from "./context/theme"; // 引入创建好的上下文
import {
  NodeIndexOutlined,
  TeamOutlined,
  PicCenterOutlined,
  ImportOutlined,
  ExportOutlined,
  CloseOutlined,
  SunOutlined,
  MoonOutlined,
  QuestionCircleOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
// import { red } from "@mui/material/colors";
// import OutputDrawer from "../components/algorithmOutputs/OutputDrawer/OutputDrawer";
const { Search } = Input;
const { Header, Sider } = Layout;

const SideMenu = ({ isDarkMode, searchTerm, onAlgorithmClick }) => {
  const [openKeys, setOpenKeys] = useState([]);

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

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
  ];

  const filteredMenu = menuData
    .map((category) => ({
      ...category,
      children: category.children?.filter((alg) =>
        alg.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(
      (category) =>
        category.children?.length ||
        category.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
      onOpenChange={handleOpenChange}>
      {renderMenuItems(filteredMenu)}
    </Menu>
  );
};

function Demo() {
  const navigate = useNavigate();

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

  const [gravity, setGravity] = useState(0);
  const [nodeSizeScale, setNodeSizeScale] = useState(1);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAlgorithmClick = (algorithm) => {
    setSelectedAlgorithm(algorithm);
    setDrawerVisible(true);
  };

  useEffect(() => {
    if (performance.navigation.type === 1) return; // 如果本来就是刷新进来的
    window.location.reload();
  }, []);

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
  const [leftCollapsed, setLeftCollapsed] = useState(true);
  const [rightCollapsed, setRightCollapsed] = useState(true);
  const { isDarkMode, setIsDarkMode, currentThemeToken } =
    useContext(ThemeContext);

  return (
    <ConfigProvider
      theme={{
        token: currentThemeToken,
        components: {
          Layout: {
            colorBgHeader: currentThemeToken.colorBgContainer,
            colorBgLayout: currentThemeToken.colorBgContainer,
            siderBg: currentThemeToken.colorBgContainer,
          },
          Menu: {
            colorBgBase: currentThemeToken.colorBgContainer,
            darkItemBg: currentThemeToken.colorBgContainer,
            darkSubMenuItemBg: currentThemeToken.colorBgContainer,
            darkItemSelectedBg: currentThemeToken.colorPrimary,
          },
          Breadcrumb: {
            separatorMargin: "20px",
            linkColor: currentThemeToken.colorText,
            lastItemColor: currentThemeToken.colorHeader,
            separatorColor: currentThemeToken.colorText,
          },
          Modal: {
            contentBg: currentThemeToken.color2, // Modal overall background color
            headerBg: currentThemeToken.color2, // Modal title background color
            titleColor: currentThemeToken.colorText, // Modal title text color
            footerBg: currentThemeToken.colorPrimary, // Modal bottom background color
          },
          Input: {
            activeBorderColor: currentThemeToken.colorText, // Border selected color
            hoverBorderColor: currentThemeToken.colorText, // Border hover color
            borderColor: currentThemeToken.colorText, // Default border color
            colorBgContainer: currentThemeToken.colorBgContainer, // Input box background color
            colorText: currentThemeToken.colorText, // Input box text color
            colorPlaceholder: currentThemeToken.colorPlaceholder, // Placeholder text color
          },
          Button: {
            colorTextDisabled: currentThemeToken.colorTextDisabled, // Disabled text background
          },
        },
      }}>
      {loading && (
        <div className="loader-container">
          <SpinnerDotted size={100} thickness={150} color="#6750C6" />
          <p className="loading-text">{loading}</p>
        </div>
      )}

      <Layout style={{ height: "100vh", overflow: "hidden" }}>
        <Header
          className="header"
          style={{
            background: currentThemeToken.colorBgContainer,
          }}>
          {/* Logo */}
          <a className="logo" href="/">
            <img src={logo} alt="NovaGraph" className="logo" />
            <p
              className="font-logo"
              style={{ color: currentThemeToken.colorText }}>
              NovaGraph
            </p>
          </a>

          <div className="user-guide">
            {/* Dark/light mode toggle */}
            <IconButton
              sx={{
                color: currentThemeToken.colorText,
                transition: "color 0.3s, transform 0.3s",
                "&:hover": {
                  color: isDarkMode ? "#FFF" : "#555",
                },
              }}
              onClick={() => setIsDarkMode((prev) => !prev)}
              aria-label="toggle dark mode">
              {isDarkMode ? <SunOutlined /> : <MoonOutlined />}
            </IconButton>
            {/* TODO: Link to user guide page */}
            <IconButton
              sx={{
                color: currentThemeToken.colorText,
                transition: "color 0.3s, transform 0.3s",
                "&:hover": {
                  color: isDarkMode ? "#FFF" : "#555",
                },
              }}
              onClick={() => navigate("/user-guide")}
              aria-label="toggle dark mode">
              <QuestionCircleOutlined />
            </IconButton>
          </div>
        </Header>
        <Layout>
          {/* Algorithm Search Sidebar */}
          <div className="sider-container">
            <Sider
              width={leftCollapsed ? 0 : 320}
              trigger={null}
              theme={isDarkMode ? "dark" : "light"}>
              {/* Search bar */}
              <div style={{ padding: "1rem" }}>
                <Search
                  placeholder="Search for Algorithms..."
                  onChange={handleSearch}
                  allowClear
                  enterButton
                  style={{
                    width: "100%",
                  }}
                />
              </div>
              <Flex vertical gap="small" style={{ padding: "10px" }}>
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
                    }}>
                    Import Graph
                  </Button>
                </Tooltip>
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
                    disabled={activeResponse === null}>
                    Export Algorithm Data
                  </Button>
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
              </Flex>

              <SideMenu
                isDarkMode={isDarkMode}
                searchTerm={searchTerm}
                onAlgorithmClick={handleAlgorithmClick}
              />

              <Modal
                title={selectedAlgorithm?.title || "Algorithm Details"}
                open={drawerVisible}
                onCancel={() => setDrawerVisible(false)}
                footer={null}
                width={600}
                closeIcon={
                  <CloseOutlined
                    style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
                  />
                }>
                {selectedAlgorithm ? (
                  (() => {
                    switch (selectedAlgorithm.key) {
                      case "AtoB":
                        return (
                          <AlgorithmInput
                            wasmFunction={
                              wasmModule &&
                              wasmModule[
                                algorithmConfig.DIJKSTRA_A_TO_B
                                  .wasm_function_name
                              ]
                            }
                            postState={postAlgorithmState.bind(
                              null,
                              Algorithm.DIJKSTRA_A_TO_B
                            )}
                            setLoading={setLoading}
                            algorithmName="Dijkstra (A to B)"
                            desc={[
                              "Find the shortest path from node A to node B.",
                            ]}
                            nodes={nodes}
                            setHoveredAlgorithm={setHoveredAlgorithm}
                            // hoveredAlgorithm={Algorithm.DIJKSTRA_A_TO_B}
                            inputs={[
                              { label: "Start Node", type: "node" },
                              { label: "End Node", type: "node" },
                            ]}
                            handleClose={() => setDrawerVisible(false)}
                          />
                        );
                      case "AtoAll":
                        return (
                          <AlgorithmInput
                            wasmFunction={
                              wasmModule &&
                              wasmModule[
                                algorithmConfig.DIJKSTRA_A_TO_ALL
                                  .wasm_function_name
                              ]
                            }
                            postState={postAlgorithmState.bind(
                              null,
                              Algorithm.DIJKSTRA_ALL
                            )}
                            setLoading={setLoading}
                            algorithmName="Dijkstra (A to All)"
                            desc={[
                              "Find the shortest path from node A to all other nodes.",
                            ]}
                            nodes={nodes}
                            setHoveredAlgorithm={setHoveredAlgorithm}
                            hoveredAlgorithm={Algorithm.DIJKSTRA_A_TO_ALL}
                            inputs={[{ label: "Start Node", type: "node" }]}
                            handleClose={() => setDrawerVisible(false)}
                          />
                        );
                      case "bfs":
                        return (
                          <AlgorithmInput
                            wasmFunction={
                              wasmModule[algorithmConfig.BFS.wasm_function_name]
                            }
                            postState={postAlgorithmState.bind(
                              null,
                              Algorithm.BFS
                            )}
                            setLoading={setLoading}
                            algorithmName="Breadth-First Search"
                            desc={[
                              "Traverse the graph using BFS starting from a node.",
                            ]}
                            nodes={nodes}
                            setHoveredAlgorithm={setHoveredAlgorithm}
                            hoveredAlgorithm={Algorithm.BFS}
                            inputs={[{ label: "Start Node", type: "node" }]}
                            handleClose={() => setDrawerVisible(false)}
                          />
                        );
                      case "degree":
                        return (
                          <AlgorithmInput
                            wasmFunction={wasmModule?.degree_centrality}
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
                            handleClose={() => setDrawerVisible(false)}
                          />
                        );
                      case "closeness":
                        return (
                          <AlgorithmInput
                            wasmFunction={wasmModule?.closeness_centrality}
                            postState={postAlgorithmState.bind(
                              null,
                              Algorithm.CLOSENESS_CENTRALITY
                            )}
                            setLoading={setLoading}
                            algorithmName="Closeness Centrality"
                            desc={[
                              "Closeness centrality measures how close a node is to all other nodes.",
                            ]}
                            nodes={nodes}
                            setHoveredAlgorithm={setHoveredAlgorithm}
                            hoveredAlgorithm={Algorithm.CLOSENESS_CENTRALITY}
                            inputs={[]}
                            handleClose={() => setDrawerVisible(false)}
                          />
                        );
                      case "betweenness":
                        return (
                          <AlgorithmInput
                            wasmFunction={wasmModule?.betweenness_centrality}
                            postState={postAlgorithmState.bind(
                              null,
                              Algorithm.BETWEENNESS_CENTRALITY
                            )}
                            setLoading={setLoading}
                            algorithmName="Betweenness Centrality"
                            desc={[
                              "Betweenness centrality measures how often a node is on the shortest path between other nodes.",
                            ]}
                            nodes={nodes}
                            setHoveredAlgorithm={setHoveredAlgorithm}
                            hoveredAlgorithm={Algorithm.BETWEENNESS_CENTRALITY}
                            inputs={[]}
                            handleClose={() => setDrawerVisible(false)}
                          />
                        );
                      case "louvain":
                        return (
                          <AlgorithmInput
                            wasmFunction={wasmModule?.louvain_method}
                            postState={postAlgorithmState.bind(
                              null,
                              Algorithm.LOUVAIN
                            )}
                            setLoading={setLoading}
                            algorithmName="Louvain Method"
                            desc={[
                              "Detects communities in the graph using modularity optimization.",
                            ]}
                            nodes={nodes}
                            setHoveredAlgorithm={setHoveredAlgorithm}
                            hoveredAlgorithm={Algorithm.LOUVAIN}
                            inputs={[]}
                            handleClose={() => setDrawerVisible(false)}
                          />
                        );
                      case "girvan":
                        return (
                          <AlgorithmInput
                            wasmFunction={wasmModule?.girvan_newman}
                            postState={postAlgorithmState.bind(
                              null,
                              Algorithm.GIRVAN_NEWMAN
                            )}
                            setLoading={setLoading}
                            algorithmName="Girvan-Newman Algorithm"
                            desc={[
                              "Detects communities in the graph by progressively removing edges.",
                            ]}
                            nodes={nodes}
                            setHoveredAlgorithm={setHoveredAlgorithm}
                            hoveredAlgorithm={Algorithm.GIRVAN_NEWMAN}
                            inputs={[]}
                            handleClose={() => setDrawerVisible(false)}
                          />
                        );
                      default:
                        return (
                          <Typography.Text
                            style={{ color: currentThemeToken.colorText }}>
                            Please select an algorithm to view its details.
                          </Typography.Text>
                        );
                    }
                  })()
                ) : (
                  <Typography.Text
                    style={{ color: currentThemeToken.colorText }}>
                    Please select an algorithm to view its details.
                  </Typography.Text>
                )}
              </Modal>
            </Sider>
            {/* Sider Trigger */}
            <div
              className="left-sider-trigger"
              style={{ background: currentThemeToken.colorBgContainer }}>
              <IconButton
                sx={{ color: currentThemeToken.colorText, margin: "0.25rem" }}
                onClick={() => setLeftCollapsed((prev) => !prev)}>
                {leftCollapsed ? (
                  <DoubleRightOutlined />
                ) : (
                  <DoubleLeftOutlined />
                )}
              </IconButton>
              <Divider style={{ margin: 0 }} />
              <IconButton
                sx={{
                  color: currentThemeToken.colorText,
                  margin: "0.25rem",
                  cursor: "default",
                }}>
                <NodeIndexOutlined />
              </IconButton>
            </div>
          </div>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              backgroundColor: "#222",
            }}>
            <GraphRenderer
              nodes={nodes}
              links={edges}
              directed={directed}
              colors={colorMap}
              sizes={sizeMap}
              mode={renderMode}
              gravity={gravity}
              nodeSizeScale={nodeSizeScale}
            />
            <AlgorithmOutput
              algorithm={activeAlgorithm}
              response={activeResponse}
            />
          </Box>
          {/* Graph Settings Sidebar */}
          <div className="sider-container">
            <Sider
              width={rightCollapsed ? 0 : 320}
              trigger={null}
              theme={isDarkMode ? "dark" : "light"}>
              <div style={{ height: "100%" }}>
                <Box width={{ xs: "10rem", sm: "15rem" }} p={3}>
                  <Typography
                    variant="h2"
                    sx={{
                      color: currentThemeToken.colorText,
                      fontSize: "27px",
                      textAlign: "center",
                      mb: 3,
                    }}>
                    Graph Options
                  </Typography>
                  <Divider
                    sx={{ backgroundColor: currentThemeToken.colorText }}
                  />

                  <Box
                    pt={3}
                    sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{
                          color: currentThemeToken.colorText,
                          fontSize: "20px",
                          textAlign: "center",
                        }}>
                        Graph Strength
                      </Typography>
                      <RadioGroup
                        value={gravity}
                        onChange={(event) =>
                          setGravity(parseFloat(event.target.value))
                        }>
                        <FormControlLabel
                          value={0}
                          control={
                            <Radio
                              sx={{ color: currentThemeToken.colorText }}
                            />
                          }
                          label={
                            <Typography
                              variant="body2"
                              sx={{ color: currentThemeToken.colorText }}>
                              Zero Gravity (default)
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          value={0.1}
                          control={
                            <Radio
                              sx={{ color: currentThemeToken.colorText }}
                            />
                          }
                          label={
                            <Typography
                              variant="body2"
                              sx={{ color: currentThemeToken.colorText }}>
                              Low Gravity
                            </Typography>
                          }
                        />
                        <FormControlLabel
                          value={0.5}
                          control={
                            <Radio
                              sx={{ color: currentThemeToken.colorText }}
                            />
                          }
                          label={
                            <Typography
                              variant="body2"
                              sx={{ color: currentThemeToken.colorText }}>
                              High Gravity
                            </Typography>
                          }
                        />
                      </RadioGroup>
                      <Typography
                        variant="body2"
                        sx={{ color: currentThemeToken.colorText }}>
                        Modifies the gravitational strength of the center of the
                        graph.
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="h4"
                        sx={{
                          color: currentThemeToken.colorText,
                          fontSize: "20px",
                          textAlign: "center",
                        }}>
                        Node Scalar Size
                      </Typography>
                      <RadioGroup
                        value={nodeSizeScale}
                        onChange={(event) =>
                          setNodeSizeScale(parseFloat(event.target.value))
                        }>
                        {[0, 0.25, 0.5, 1, 1.5, 2].map((value, index) => (
                          <FormControlLabel
                            key={value}
                            value={value}
                            control={
                              <Radio
                                sx={{ color: currentThemeToken.colorText }}
                              />
                            }
                            label={
                              <Typography
                                variant="body2"
                                sx={{ color: currentThemeToken.colorText }}>
                                {
                                  [
                                    "Invisible",
                                    "Extra Small",
                                    "Small",
                                    "Medium (default)",
                                    "Large",
                                    "Extra Large",
                                  ][index]
                                }
                              </Typography>
                            }
                          />
                        ))}
                      </RadioGroup>
                      <Typography
                        variant="body2"
                        sx={{ color: currentThemeToken.colorText }}>
                        Modify the sizes for all nodes.
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </div>
            </Sider>
            <div
              className="right-sider-trigger"
              style={{ background: currentThemeToken.colorBgContainer }}>
              <IconButton
                sx={{ color: currentThemeToken.colorText, margin: "0.25rem" }}
                onClick={() => setRightCollapsed((prev) => !prev)}>
                {rightCollapsed ? (
                  <DoubleLeftOutlined />
                ) : (
                  <DoubleRightOutlined />
                )}
              </IconButton>
              <Divider style={{ margin: 0 }} />
              <IconButton
                sx={{
                  color: currentThemeToken.colorText,
                  margin: "0.25rem",
                  cursor: "default",
                }}>
                <SettingOutlined />
              </IconButton>
            </div>
          </div>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default Demo;
