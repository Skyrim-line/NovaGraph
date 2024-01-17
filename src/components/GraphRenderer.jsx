import { Cosmograph } from '@cosmograph/react'
import { useRef, useCallback } from 'react';

export function GraphRenderer({ colors }) {

    const cosmograph = useRef()

    const zoomToNode = useCallback((node, i, pos, event) => {
        if (node && i != undefined) {
            cosmograph.current?.selectNode(node);
            cosmograph.current?.zoomToNode(node);
        } else {
            cosmograph.current?.unselectNodes();
            cosmograph.current?.fitView(1000);
        }
    })

    return(<Cosmograph
        ref={cosmograph}
        initialZoomLevel={10}
        disableSimulation={false}
        //backgroundColor='#151515'
        nodeSize={20}
        nodeColor={(node, id) => colors[id] || '#4B5BBF'}
        linkColor={(link, id) => colors[`${link.source}-${link.target}`] || '#5F74C2' }
        nodeGreyoutOpacity={0.1}
        //linkWidth={2}
        //linkColor='#5F74C2'
        linkArrows={false}
        
        //renderHoveredNodeRing={true}
        //hoveredNodeRingColor='#4B5BBF'
        linkGreyoutOpacity={0}
        simulationLinkDistance={20}
        simulationLinkSpring={2}
        simulationRepulsion={2}
        simulationGravity={0.1}
        onClick={zoomToNode}
    />)
}