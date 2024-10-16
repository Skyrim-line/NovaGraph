import React from 'react';

export const algorithmConfig = {
    DIJKSTRA_A_TO_B: {
        "category": "pfs",
        "button_text": "Dijkstra (A to B)",
        "hover_text_html": (
            <>The shortest path (or smallest sum of weights) from one node to another using 
            <strong> Dijkstra's Algorithm</strong>.</>
        ),
        "long_description": [
            "Dijkstra's algorithm finds the shortest path from one node to another."
        ],
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
        "modal_title": "Dijkstra Path Details",
        "modal_columns": (data) => data.weighted ? ['From', 'To', 'Weight'] : ['From', 'To'],
        "data_array": (data) => data.path,
        "data_array_keys": (data) => data.weighted ? ['from', 'to', 'weight'] : ['from', 'to']
    }
}
