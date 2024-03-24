import { Cosmograph, CosmographProvider } from '@cosmograph/react'
import React, { useRef, useCallback, useEffect, useState, useLayoutEffect } from 'react';
import chroma from "chroma-js";
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import { Mode } from '../renderModes';

export function GraphRenderer({ colors, sizes, nodes, links, mode }) {
    const cosmograph = useRef()
    const scale = chroma.scale(['#F7EBFF', '#6750C6']);
    /* Palette: https://mycolor.space/?hex=%236750C6&sub=1 (Spot Palette)
        - Dark: #6750c6
        - Default: #9f8fc3
        - Light: #f7ebff
        - Contrast (Green): #67baa7
    */

    useEffect(() => {
        console.log(`Mode: ${mode}`)
        console.log(`MODE ${Mode.MULTI_SHADE}`)
        switch(mode) {
            case Mode.MULTI_SHADE:
                console.log("multi shade"); break
            case Mode.TWO_TONED:
                console.log("two tond"); break
        }
    }, [colors, sizes])

    const zoomToNode = useCallback((node, i, pos, event) => {
        if (node && i != undefined) {
            cosmograph.current?.selectNode(node);
            cosmograph.current?.zoomToNode(node);
        } else {
            cosmograph.current?.unselectNodes();
            cosmograph.current?.fitView(1000);
        }
    })

    // colorspace with 6B0072
    const getColor = (freq, id) => {
        if (mode == 4) {
            const hue = freq * 137.508; // use golden angle approximation
            return `hsl(${hue + 50},100%,75%)`;
        } else if (mode == 2 && freq > 0) {
            return scale(freq / nodes.length).hex()
        } else if (freq > 0) {
            return scale(1).hex() // DARK (mode 1 but freq)
        } else if (mode == 2) {
            return '#F05480' // RED (mode 2 but freq=0)
        } else {
            return '#9f8fc3' // NEUTRAL (mode 3/4)
        }
    }

    return(
    <Box sx={{ display:'flex', flexDirection: 'column', height: '75vh' }}>
        
        <CosmographProvider nodes={nodes} links={links}>
            <Cosmograph
                ref={cosmograph}
                //initialZoomLevel={1}
                disableSimulation={false}
                //backgroundColor='#151515'
                nodeSize={(_node, id) => sizes[id] ? sizes[id] : 20}
                nodeColor={(_node, id) => getColor(colors[id], id)}
                linkColor={(link) => colors[`${link.source}-${link.target}`] > 0 ? '#67baa7' : null}
                nodeGreyoutOpacity={0.1}
                linkWidth={(link) => colors[`${link.source}-${link.target}`] > 0 ? 3 : 0.1}

                //TODO: nodeLabelAccessor={(node) => node.name}
                linkArrows={false}
                
                //renderHoveredNodeRing={true}
                //hoveredNodeRingColor='#4B5BBF'
                linkGreyoutOpacity={0}
                //simulationLinkDistance={20}
                //simulationLinkSpring={1.5}
                simulationRepulsion={2}
                //simulationGravity={1}
                simulationLinkSpring={0.01}
                simulationDecay={100000}
                onClick={zoomToNode}
            />

            {/*
            TODO: have some sort of a form/modal here:

            Select source vertex: (info hover icon)
            <CosmographSearch onSelectResult={event => setState(event.id)} />

            Select target vertex: (info hover icon)
            <CosmographSearch onSelectResult={event => console.log(event)} />

            Enter some other variable: _______

            [Cancel] [Go]
        */}

        </CosmographProvider>

        <Box display='flex'>
            <Tooltip title="Play Simulation">
                <IconButton aria-label='play-simulation' onClick={() => cosmograph.current?.start()}>
                    <PlayArrowIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Pause Simulation">
                <IconButton aria-label='pause-simulation' onClick={() => cosmograph.current?.pause()}>
                    <PauseIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Restart Simulation">
                <IconButton aria-label='restart-simulation' onClick={() => cosmograph.current?.create()}>
                    <ReplayIcon />
                </IconButton>
            </Tooltip>
            
            

            <Box flexGrow={1} />
            
            <Tooltip title="Graph Options">
                <IconButton aria-label='graph-options'>
                    <SettingsIcon />
                </IconButton>
            </Tooltip>
        </Box>
        
    </Box>
    )
}