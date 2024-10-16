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
        "data_array_keys": (data) => data.weighted ?
            [
                {'key': "from"},
                {'key': "to"},
                {'key': "weight"}
            ] : [
                {'key': "from"},
                {'key': "to"}
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
        "data_array_keys": (data) => data.weighted ?
            [
                {'key': "target"},
                {'key': "path", 'fn': "join", 'args': [" → "]},
                {'key': "weight"}
            ] : [
                {'key': "target"},
                {'key': "path", 'fn': "join", 'args': [" → "]},
                {'key': "path", 'fn': "length"}
            ]
    }
}
