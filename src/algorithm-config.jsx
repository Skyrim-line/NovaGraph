import React from 'react';

const exampleConfig = { /* ... */ }

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
            {'key': "from"},
            {'key': "to"},
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
            {'key': "target"},
            {'key': "path", 'fn': "join", 'args': [" → "]},
            data.weighted ? {'key': "weight"} : {'key': "path", 'fn': "length"}
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
            {'key': "num"},
            {'key': "path", 'fn': "join", 'args': [" → "]},
            data.weighted ? {'key': "weight"} : {'key': "path", 'fn': "length"}
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
            {'key': "from"},
            {'key': "to"},
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
            {'key': "target"},
            {'key': "path", 'fn': "join", 'args': [" → "]},
            data.weighted ? {'key': "weight"} : {'key': "path", 'fn': "length"}
        ]
    },
}
