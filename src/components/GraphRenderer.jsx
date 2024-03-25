import { Cosmograph, CosmographProvider, CosmographSearch } from '@cosmograph/react'
import React, { useRef, useCallback, useEffect, useState, useLayoutEffect } from 'react';
import chroma from "chroma-js";
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import LabelIcon from '@mui/icons-material/Label';
import LabelOffIcon from '@mui/icons-material/LabelOff';
import { Mode } from '../renderModes';

export function GraphRenderer({ colors, sizes, nodes, links, directed, mode }) {
    const cosmograph = useRef()
    const scale = chroma.scale(['#F7EBFF', '#6750C6']);
    const error = '#F05480'
    const neutral = '#9f8fc3'
    /* Palette: https://mycolor.space/?hex=%236750C6&sub=1 (Spot Palette)
        - Dark: #6750c6
        - Default: #9f8fc3
        - Light: #f7ebff
        - Contrast (Green): #67baa7
    */

        
    const [selectedNode, setSelectedNode] = useState(null);
    const [dynamicLabels, setDynamicLabels] = useState(true);

    useEffect(() => {
        console.log('Restarting graph...')
        cosmograph.current?.create();
        cosmograph.current?.fitView();
    }, [nodes, links, directed])

    const zoomOut = () => {
        cosmograph.current?.unselectNodes();
        cosmograph.current?.fitView(500);
        setSelectedNode(null);
    }

    const zoomToNode = useCallback((node, i) => {
        if (node && i != undefined && node != selectedNode) {
            cosmograph.current?.selectNode(node);
            cosmograph.current?.zoomToNode(node);
            setSelectedNode(node);
        } else {
            zoomOut();
        }
    })

    
    const getColor = value => {
        switch(mode) {
            case Mode.COLOR_IMPORTANT:
                return value > 0 ? scale(1).hex() : (value < 0 ? error : neutral);
            case Mode.COLOR_SHADE_DEFAULT:
                return value ? scale(value).hex() : neutral;
            case Mode.COLOR_SHADE_ERROR:
                return value ? scale(value).hex() : error;
            case Mode.SIZE_SCALAR:
                return neutral;
            case Mode.RAINBOW:
                return `hsl(${(value * 137.508) + 50},100%,75%)`;
            default:
                return neutral
        }
    }

    const getLinkColor = link => {
        if (colors[`${link.source}-${link.target}`] > 0) {
            return '#67baa7'
        } else if (colors[`${link.target}-${link.source}`] > 0) {
            return '#67baa7'
        } else {
            return null
        }
    }

    const getLinkWidth = link => {
        if (colors[`${link.source}-${link.target}`] > 0) {
            return 3
        } else if (colors[`${link.target}-${link.source}`] > 0) {
            return 3
        } else {
            return 0.1
        }
    }

    return(
    <Box sx={{ display:'flex', flexDirection: 'column', height: '75vh' }}>
        
        <CosmographProvider nodes={nodes} links={links}>
            <CosmographSearch
                onSelectResult={n => cosmograph.current?.selectNode(n)}
                accessors={[{ label: 'Name', accessor: n => n.name }]}
            />
            
            <Cosmograph
                ref={cosmograph}
                //initialZoomLevel={1}
                disableSimulation={false}
                //backgroundColor='#151515'
                nodeSize={(_node, id) => sizes[id] ? sizes[id] : 20}
                nodeColor={(_node, id) => getColor(colors[id])}
                linkColor={link => getLinkColor(link)}
                nodeGreyoutOpacity={0.1}
                linkWidth={link => getLinkWidth(link)}

                nodeLabelAccessor={(node) => node.name ? node.name : node.id}
                linkArrows={directed}
                showDynamicLabels={dynamicLabels}
                
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
            <Tooltip title="Fit All">
                <IconButton aria-label='fit-view' onClick={zoomOut}>
                    <ZoomOutMapIcon />
                </IconButton>
            </Tooltip>
            
            

            <Box flexGrow={1} />

            {
                dynamicLabels ?
                <Tooltip title="Hide Dynamic Labels">
                    <IconButton aria-label='hide-labels' onClick={() => setDynamicLabels(false)}>
                        <LabelIcon />
                    </IconButton>
                </Tooltip>
                :
                <Tooltip title="Show Dynamic Labels">
                    <IconButton aria-label='show-labels' onClick={() => setDynamicLabels(true)}>
                        <LabelOffIcon />
                    </IconButton>
                </Tooltip>
            
            }
            
            <Tooltip title="Graph Options">
                <IconButton aria-label='graph-options'>
                    <SettingsIcon />
                </IconButton>
            </Tooltip>
        </Box>
        
    </Box>
    )
}