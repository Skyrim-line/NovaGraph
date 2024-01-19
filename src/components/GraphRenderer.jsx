import { Cosmograph } from '@cosmograph/react'
import { useRef, useCallback } from 'react';
import chroma from "chroma-js";

export function GraphRenderer({ colors, nodes, colorAll }) {
    const cosmograph = useRef()
    const scale = chroma.scale(['#FDF7FF', '#6750C6']);

    const zoomToNode = useCallback((node, i, pos, event) => {
        if (node && i != undefined) {
            cosmograph.current?.selectNode(node);
            cosmograph.current?.zoomToNode(node);
        } else {
            cosmograph.current?.unselectNodes();
            cosmograph.current?.fitView(1000);
        }
    })

    const test = () => {
        //cosmograph.current?.fitView()
        cosmograph.current?.zoom(10)
        
    }

    // colorspace with 6B0072
    const getColor = (freq, id) => {
        if (colorAll && freq > 0) {
            return scale(freq / nodes.length).hex()
        } else if (freq > 0) {
            return scale(1).hex()
        } else if (colorAll) {
            return '#F05480'
        } else {
            console.log("hi", freq)
            return '#fff'
        }
    }

    return(<Cosmograph
        ref={cosmograph}
        initialZoomLevel={undefined}
        disableSimulation={false}
        //backgroundColor='#151515'
        nodeSize={20}
        nodeColor={(node, id) => getColor(colors[id], id)}
        linkColor={(link, id) => colors[`${link.source}-${link.target}`] > 0 ? '#E4C1FF' : '#fff'}
        nodeGreyoutOpacity={0.1}
        linkWidth={2}
        //linkColor='#5F74C2'
        linkArrows={false}
        
        //renderHoveredNodeRing={true}
        //hoveredNodeRingColor='#4B5BBF'
        linkGreyoutOpacity={0}
        simulationLinkDistance={20}
        simulationLinkSpring={2}
        simulationRepulsion={1}
        simulationGravity={0.01}
        simulationDecay={100000}
        onClick={zoomToNode}
    />)
}