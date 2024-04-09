import { Cosmograph, CosmographProvider, CosmographSearch } from '@cosmograph/react'
import React, { useRef, useCallback, useEffect, useState, useLayoutEffect } from 'react';
import chroma from "chroma-js";
import { debounce } from "lodash";
import { Box, Button, Divider, Drawer, IconButton, Slider, Tooltip, Typography } from '@mui/material';
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
    const contrast_green = '#67baa7'
    /* Palette: https://mycolor.space/?hex=%236750C6&sub=1 (Spot Palette)
        - Dark: #6750c6
        - Default: #9f8fc3
        - Light: #f7ebff
        - Contrast (Green): #67baa7
    */

    const [selectedNode, setSelectedNode] = useState(null);
    const [dynamicLabels, setDynamicLabels] = useState(true);
    const [optionsDrawer, setOptionsDrawer] = useState(false);

    const [repulsion, setRepulsion] = useState(2);
    const [gravity, setGravity] = useState(0);
    const [nodeSizeScale, setNodeSizeScale] = useState(1);

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
                return isNaN(value) ? scale(0).hex() : scale(value).hex();
            case Mode.COLOR_SHADE_ERROR:
                return isNaN(value) ? error : scale(value).hex();
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
            return contrast_green
        } else if (colors[`${link.target}-${link.source}`] > 0) {
            return contrast_green
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
                
                renderHoveredNodeRing={true}
                hoveredNodeRingColor={contrast_green}

                linkGreyoutOpacity={0}
                simulationLinkSpring={0.01}
                simulationDecay={100000}

                nodeSizeScale={nodeSizeScale}
                simulationRepulsion={repulsion}
                simulationGravity={gravity}

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
                <IconButton aria-label='graph-options' onClick={() => setOptionsDrawer(true)}>
                    <SettingsIcon />
                </IconButton>
            </Tooltip>

            <Drawer
                anchor='right'
                open={optionsDrawer}
                onClose={() => setOptionsDrawer(false)}
                slotProps={{ backdrop: {sx: { backgroundColor: 'transparent' }} }}
                elevation={0}
            >
                <Box width={{ xs: '10rem', sm: '15rem'}} p={3}>
                    <Typography variant='h5' align='center' pb={2}>Graph Options</Typography>
                    <Divider />

                    {/* Title and slider for graph repulsion (default 2 but slider should range from 0-3) */}
                    <Box pt={3} sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <Box>
                            <Typography variant='h6' align='center'>Repulsion</Typography>
                            <Slider
                                value={repulsion}
                                color='info'
                                min={0}
                                max={2}
                                step={0.05}
                                valueLabelDisplay='auto'
                                onChange={debounce((_, value) => setRepulsion(value), 300)}
                            />
                            <Typography variant='body2'>Affects how quickly nodes repel from each other (default: 2)</Typography>
                        </Box>
                        <Box>
                            <Typography variant='h6' align='center'>Gravity Strength</Typography>
                            <Slider
                                value={gravity}
                                color='info'
                                min={0}
                                max={0.5}
                                step={0.1}
                                valueLabelDisplay='auto'
                                onChange={debounce((_, value) => setGravity(value), 300)}
                            />
                            <Typography variant='body2'>
                                Modifies the gravitational strength of the center of the graph (default: 0)
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant='h6' align='center'>Node Scalar Size</Typography>
                            <Slider
                                value={nodeSizeScale}
                                color='info'
                                min={0}
                                max={2}
                                step={0.25}
                                valueLabelDisplay='auto'
                                onChange={debounce((_, value) => setNodeSizeScale(value), 300)}
                            />
                            <Typography variant='body2'>Modify node sizes (default: 1)</Typography>
                        </Box>

                    </Box>
                    
                </Box>
            </Drawer>
        </Box>
        
    </Box>
    )
}