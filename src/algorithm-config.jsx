import React from 'react';



export const algorithmConfig = {
    DIJKSTRA_A_TO_B: {
        "category": "pfs",
        "button_text": "Dijkstra (A to B)",
        "hover_text_html": <>
            The shortest path (or smallest sum of weights) from one node to another using <strong> Dijkstra's Algorithm</strong>.
        </>,
        "long_description_html": <>
            Dijkstra's algorithm finds the shortest path from one node to another.
        </>,
        "wasm_function_name": "dijkstra_source_to_target",
        "input_type": "default",
        "input_fields": [
            {
                "label": "Enter source vertex",
                "type": "text"
            },
            {
                "label": "Enter target vertex",
                "type": "text"
            }
        ],
        "result_heading": (data) => `Dijkstra's Shortest Path from [${data.source}] to [${data.target}]`,
        "result_summary": [
            {
                "label": "Path Length",
                "value": (data) => data.path.length
            },
            {
                "label": "Path Weight",
                "value": (data) => data.weighted ? data.totalWeight : "N/A"
            }
        ],
        "modal_title": () => "Dijkstra Path Details",
        "modal_columns": (data) => data.weighted ? ['From', 'To', 'Weight'] : ['From', 'To'],
        "data_array": (data) => data.path,
        "data_array_keys": (data) => [
            { 'key': "from" },
            { 'key': "to" },
            ...(data.weighted ? [{ 'key': "weight" }] : [])
        ]
    },
    DIJKSTRA_A_TO_ALL: {
        "category": "pfs",
        "button_text": "Dijkstra (A to All)",
        "hover_text_html": <>
            The shortest path from one node to <strong>all other nodes</strong> using Dijkstra's Algorithm.
            Node shades are based their frequency of being visited.
        </>,
        "long_description_html": <>
            Dijkstra's algorithm finds the shortest path from one node to all other nodes.
        </>,
        "wasm_function_name": "dijkstra_source_to_all",
        "input_type": "default",
        "input_fields": [
            {
                "label": "Enter source vertex",
                "type": "text"
            }
        ],
        "result_heading": (data) => `Dijkstra's Shortest Path from [${data.source}] to All`,
        "result_summary": [],
        "modal_title": (data) => `Dijkstra Paths from [${data.source}]`,
        "modal_columns": (data) => ['To', 'Path', data.weighted ? 'Weight' : 'Length'],
        "data_array": (data) => data.paths,
        "data_array_keys": (data) => [
            { 'key': "target" },
            { 'key': "path", 'fn': "join", 'args': [" → "] },
            data.weighted ? { 'key': "weight" } : { 'key': "path", 'fn': "length" }
        ]
    },
    YEN: {
        "category": "pfs",
        "button_text": "Yen's Shortest Paths",
        "hover_text_html": <>
            The <code>k</code> shortest paths from one node to another.
        </>,
        "long_description_html": <>
            Yen's algorithm finds the <i>k</i> shortest paths from one node to another.
        </>,
        "wasm_function_name": "yens_algorithm",
        "input_type": "default",
        "input_fields": [
            {
                "label": "Enter source vertex",
                "type": "text"
            },
            {
                "label": "Enter target vertex",
                "type": "text"
            },
            {
                "label": "Enter k",
                "type": "number",
                "step": 1,
                "defaultValue": 3
            }
        ],
        "result_heading": (data) => `Yen's Shortest Paths from [${data.source}] to [${data.target}]`,
        "result_summary": [
            {
                "label": "Paths Found",
                "value": (data) => `${data.paths ? data.paths.length : 0}/${data.k}`
            }
        ],
        "modal_title": (data) => `k=${data.k} Paths from [${data.source}] to [${data.target}]`,
        "modal_columns": (data) => ['#', 'Path', data.weighted ? 'Weight' : 'Length'],
        "data_array": (data) => data.paths,
        "data_array_keys": (data) => [
            { 'key': "num" },
            { 'key': "path", 'fn': "join", 'args': [" → "] },
            data.weighted ? { 'key': "weight" } : { 'key': "path", 'fn': "length" }
        ]
    },
    BELLMAN_FORD_A_TO_B: {
        "category": "pfs",
        "button_text": "Bellman-Ford (A to B)",
        "hover_text_html": <>
            The shortest path (or smallest sum of weights) from one node to another using
            the <strong>Bellman-Ford Algorithm</strong>.
        </>,
        "long_description_html": <>
            Bellman-Ford algorithm finds the shortest path from one node to another. It works similarly to <b>Dijkstra's algorithm</b>.
        </>,
        "wasm_function_name": "bellman_ford_source_to_target",
        "input_type": "default",
        "input_fields": [
            {
                "label": "Enter source vertex",
                "type": "text"
            },
            {
                "label": "Enter target vertex",
                "type": "text"
            }
        ],
        "result_heading": (data) => `Bellman-Ford Shortest Path from [${data.source}] to [${data.target}]`,
        "result_summary": [
            {
                "label": "Path Length",
                "value": (data) => data.path.length
            },
            {
                "label": "Path Weight",
                "value": (data) => data.weighted ? data.totalWeight : "N/A"
            }
        ],
        "modal_title": () => "Bellman-Ford Path Details",
        "modal_columns": (data) => data.weighted ? ['From', 'To', 'Weight'] : ['From', 'To'],
        "data_array": (data) => data.path,
        "data_array_keys": (data) => [
            { 'key': "from" },
            { 'key': "to" },
            ...(data.weighted ? [{ 'key': "weight" }] : [])
        ]
    },
    BELLMAN_FORD_A_TO_ALL: {
        "category": "pfs",
        "button_text": "Bellman-Ford (A to all)",
        "hover_text_html": <>
            The shortest path from one node to <strong>all other nodes</strong> using the
            Bellman-Ford Algorithm. Node shades are based their frequency of being visited.
        </>,
        "long_description_html": <>
            Bellman-Ford algorithm finds the shortest path from one node to all other nodes.
        </>,
        "wasm_function_name": "bellman_ford_source_to_all",
        "input_type": "default",
        "input_fields": [
            {
                "label": "Enter source vertex",
                "type": "text"
            }
        ],
        "result_heading": (data) => `Bellman-Ford Paths from [${data.source}] to All`,
        "result_summary": [],
        "modal_title": (data) => `Bellman-Ford Paths from [${data.source}]`,
        "modal_columns": (data) => ['To', 'Path', data.weighted ? 'Weight' : 'Length'],
        "data_array": (data) => data.paths,
        "data_array_keys": (data) => [
            { 'key': "target" },
            { 'key': "path", 'fn': "join", 'args': [" → "] },
            data.weighted ? { 'key': "weight" } : { 'key': "path", 'fn': "length" }
        ]
    },
    BFS: {
        "category": "pfs",
        "button_text": "Breadth-First Search",
        "hover_text_html": <>
            Traverses the graph from a source by exploring its neighbours (1st layer) <i>first </i>
            followed by the next layer. The result will segment each layer based on node shades.
        </>,
        "long_description_html": <>
            Breadth First Search algorithm traverses the graph from a source by exploring all neighbors before moving on to the next level.
            It continues until all nodes are visited.
        </>,
        "wasm_function_name": "bfs",
        "input_type": "default",
        "input_fields": [
            {
                "label": "Enter source vertex",
                "type": "text"
            }
        ],
        "result_heading": (data) => `BFS Traversal from [${data.source}]`,
        "result_summary": [
            {
                "label": "Number of layers",
                "value": (data) => data.layers.length - 1
            },
            {
                "label": "Nodes Found",
                "value": (data) => data.nodesFound
            }
        ],
        "modal_title": () => `BFS Details`,
        "modal_explanation": 'Each row contains the list of nodes found at the corresponding depth in the breadth-first search.',
        "modal_columns": () => ['Depth', 'Nodes'],
        "data_array": (data) => data.layers,
        "data_array_keys": () => [
            { 'key': "index" },
            { 'key': "layer", 'fn': "join", 'args': [', '] }
        ]
    },
    DFS: {
        "category": "pfs",
        "button_text": "Depth-First Search",
        "hover_text_html": <>
            Traverses the graph from a source by exploring as far as possible along each branch
            before <i>backtracking</i>. Node shades represent the "depth" of each node from the source.
        </>,
        "long_description_html": <>
            Depth First Search algorithm traverses the graph from a source by exploring as far as possible along each branch before backtracking.
            It continues until all nodes are visited.
        </>,
        "wasm_function_name": "dfs",
        "input_type": "default",
        "input_fields": [
            {
                "label": "Enter source vertex",
                "type": "text"
            }
        ],
        "result_heading": (data) => `DFS Traversal from [${data.source}]`,
        "result_summary": [
            {
                "label": "Number of subtrees",
                "value": (data) => data.subtrees.length
            },
            {
                "label": "Nodes Found",
                "value": (data) => data.nodesFound
            }
        ],
        "modal_title": () => `DFS Details`,
        "modal_explanation": 'Each row contains the list of nodes found during each subtree. Each time the search needs to "backtrack" to recurse over a node at a previous depth, a new subtree will begin.',
        "modal_columns": () => ['Subtree', 'Nodes'],
        "data_array": (data) => data.subtrees,
        "data_array_keys": () => [
            { 'key': "num" },
            { 'key': "tree", 'fn': "join", 'args': [' → '] }
        ]
    },
    RANDOM_WALK: {
        "category": "pfs",
        "button_text": "Random Walk",
        "hover_text_html": <>
            Traverses along a random path from a source node while considering edge directions.
        </>,
        "long_description_html": <>
            Random Walk algorithm traverses the graph by randomly selecting a neighbor to visit next.
            It continues for the specified number of steps.
        </>,
        "wasm_function_name": "random_walk",
        "input_type": "default",
        "input_fields": [
            {
                "label": "Enter source vertex",
                "type": "text"
            },
            {
                "label": "Enter number of steps",
                "type": "number",
                "step": 1,
                "defaultValue": 10
            }
        ],
        "result_heading": (data) => `Random Walk from [${data.source}]`,
        "result_summary": [
            {
                "label": "Most frequented node",
                "value": (data) => data.maxFrequencyNode
            },
            {
                "label": "This was visited",
                "value": (data) => `${data.maxFrequency} times`
            }
        ],
        "modal_title": () => `Random Walk Details`,
        "modal_explanation": 'Each row contains the list of nodes visited during the random walk.',
        "modal_columns": (data) => data.weighted ? ['Step', 'From', 'To', 'Weight'] : ['Step', 'From', 'To'],
        "data_array": (data) => data.path,
        "data_array_keys": (data) => [
            { 'key': "step" },
            { 'key': "from" },
            { 'key': "to" },
            ...(data.weighted ? [{ 'key': "weight" }] : [])
        ]
    },
    MINIMAL_SPANNING_TREE: {
        "category": "pfs",
        "button_text": "Minimal Spanning Tree",
        "hover_text_html": <>
            Find the subset of edges that connects all nodes in the graph with the minimum possible total edge weight (ignoring edge directions).
            The result may show multiple trees.
        </>,
        "long_description_html": <>
            Minimal Spanning Tree algorithm finds the subset of edges that connects all nodes in the graph with the minimum possible total edge weight.
        </>,
        "wasm_function_name": "min_spanning_tree",
        "input_type": "default",
        "input_fields": [],
        "result_heading": () => `Minimal Spanning Tree`,
        "result_summary": [
            {
                "label": "Edges in MST",
                "value": (data) => data.edges.length
            },
            {
                "label": "Total edges",
                "value": (data) => data.maxEdges
            },
            {
                "label": "MST Total Weight",
                "value": (data) => data.weighted ? data.totalWeight : "N/A"
            }
        ],
        "modal_title": () => `Minimum Spanning Tree Details`,
        "modal_columns": (data) => data.weighted ? ['#', 'From', 'To', 'Weight'] : ['#', 'From', 'To'],
        "data_array": (data) => data.edges,
        "data_array_keys": (data) => [
            { 'key': "num" },
            { 'key': "from" },
            { 'key': "to" },
            ...(data.weighted ? [{ 'key': "weight" }] : [])
        ]
    },
}
