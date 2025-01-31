// src/GraphContext.js
import { createContext, useState, useEffect } from "react";
import createModule from "../graph"; // 你原本 import createModule from "./graph"

export const GraphContext = createContext();

export function GraphProvider({ children }) {
    // 1. 把 App.js 里所有和图数据、状态有关的 useState 移到这里
    const [wasmModule, setWasmModule] = useState(null);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [existingEdges, setExistingEdges] = useState([]);
    const [tempEdges, setTempEdges] = useState([]);
    const [directed, setDirected] = useState(false);
    const [colorMap, setColorMap] = useState({});
    const [sizeMap, setSizeMap] = useState({});
    const [renderMode, setRenderMode] = useState(1);
    const [activeAlgorithm, setActiveAlgorithm] = useState(null);
    const [activeResponse, setActiveResponse] = useState(null);

    // 可能需要在不同地方显示和控制
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const [hoveredAlgorithm, setHoveredAlgorithm] = useState(null);
    const [missingEdgeDefaults, setMissingEdgeDefaults] = useState({});

    // 2. 把初始化 WASM 的 useEffect 逻辑也移动到这里
    useEffect(() => {
        createModule().then((mod) => {
            setWasmModule(mod);
            const graph = mod.initGraph(); // initialize the graph in C++
            setNodes(graph.nodes);
            setEdges(graph.edges);
            setExistingEdges(graph.edges);
            setMissingEdgeDefaults(mod.missing_edge_prediction_default_values());

            window.onerror = (message, source, lineno, colno, errObj) => {
                setLoading(null);
                // 如果 errObj 是数字, 说明是 WASM 传回来的错误
                if (typeof errObj !== "number") return;
                const pointer = errObj;
                const error_message = mod.what_to_stderr(pointer);
                setError(error_message);
            };

            window.onunload = () => {
                console.log("Cleanup");
                mod.cleanupGraph();
            };
        });
    }, []);

    // 3. 原本处理 tempEdges 与 existingEdges 的逻辑
    useEffect(() => {
        if (tempEdges.length > 0) {
            setEdges([...edges, ...tempEdges]);
        } else {
            setEdges(existingEdges);
        }
    }, [tempEdges]);

    // 4. 你可能在 App.js 中的某些函数也需要放在这里
    const updateGraph = (newNodes, newEdges, newDirected) => {
        setColorMap({});
        setSizeMap({});
        setActiveAlgorithm(null);
        setNodes(newNodes);
        setEdges(newEdges);
        setExistingEdges(newEdges);
        setDirected(newDirected);
        setRenderMode(1);
        setLoading(null);
        if (wasmModule) {
            setMissingEdgeDefaults(wasmModule.missing_edge_prediction_default_values());
        }
    };

    // 例如处理算法结果的函数
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

    // 5. 最终把所有状态和操作函数都作为 Context 的 value
    return (
        <GraphContext.Provider
            value={{
                // 所有状态
                wasmModule,
                nodes,
                setNodes,
                edges,
                setEdges,
                existingEdges,
                setExistingEdges,
                tempEdges,
                setTempEdges,
                directed,
                setDirected,
                colorMap,
                setColorMap,
                sizeMap,
                setSizeMap,
                renderMode,
                setRenderMode,
                activeAlgorithm,
                setActiveAlgorithm,
                activeResponse,
                setActiveResponse,
                error,
                setError,
                loading,
                setLoading,
                hoveredAlgorithm,
                setHoveredAlgorithm,
                missingEdgeDefaults,
                setMissingEdgeDefaults,

                // 操作函数
                updateGraph,
                postAlgorithmState,
            }}
        >
            {children}
        </GraphContext.Provider>
    );
}
