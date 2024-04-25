import { Cosmograph, CosmographProvider, CosmographSearch } from '@cosmograph/react'
import React, { useRef, useCallback, useEffect, useState, useLayoutEffect } from 'react';
import chroma from "chroma-js";
import { Box, Button, Divider, Drawer, FormControlLabel, IconButton, RadioGroup, Radio, Tooltip, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ReplayIcon from '@mui/icons-material/Replay';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import LabelOffIcon from '@mui/icons-material/LabelOff';
import { Mode } from '../renderModes';
import { ErasBold, ErasMedium } from './Eras';

export function GraphRenderer({ colors, sizes, nodes, links, directed, mode }) {
    const cosmograph = useRef()
    const scale = chroma.scale(['#e4c1ff', '#6750C6']);
    const error = '#F05480'
    const neutral = '#9f8fc3'
    const contrast_green = '#67baa7'
    const out_of_focus = '#332d48'
    /* Palette: https://mycolor.space/?hex=%236750C6&sub=1 (Spot Palette)
        - Dark: #6750c6
        - Default: #9f8fc3
        - Light: #f7ebff
        - Contrast (Green): #67baa7
    */

    const [selectedNode, setSelectedNode] = useState(null);
    const [dynamicLabels, setDynamicLabels] = useState(true);
    const [optionsDrawer, setOptionsDrawer] = useState(false);

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
    });

    const zoomGraphOut = () => {
        const zoomLevel = cosmograph.current?.getZoomLevel();
        if (zoomLevel <= 1) {
            cosmograph.current?.setZoomLevel(0.1, 500);
        } else {
            cosmograph.current?.setZoomLevel(zoomLevel - 1, 500);
        }
    }

    const zoomGraphIn = () => {
        const zoomLevel = cosmograph.current?.getZoomLevel();
        cosmograph.current?.setZoomLevel(zoomLevel + 1, 500);
    }

    
    const getColor = value => {
        switch(mode) {
            case Mode.COLOR_IMPORTANT:
                return value > 0 ? scale(1).hex() : (value < 0 ? error : neutral);
            case Mode.COLOR_SHADE_DEFAULT:
                return isNaN(value) ? out_of_focus : scale(value).hex();
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

    const getSize = id => {
        if (mode === Mode.COLOR_SHADE_DEFAULT && isNaN(colors[id])) {
            return 5
        }
        return sizes[id] ? sizes[id] : 20
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
                initialZoomLevel={1}
                disableSimulation={false}

                nodeSize={(_node, id) => getSize(id)}
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
                simulationRepulsion={2}
                simulationGravity={gravity}
                simulationLinkDistance={20}

                onClick={zoomToNode}
            />

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

            <Tooltip title="Zoom Out">
                <IconButton aria-label='zoom-out' onClick={zoomGraphOut}>
                    <ZoomOutIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Zoom In">
                <IconButton aria-label='zoom-in' onClick={zoomGraphIn}>
                    <ZoomInIcon />
                </IconButton>
            </Tooltip>
            <Divider orientation="vertical" variant='middle' flexItem />
            {
                dynamicLabels ?
                <Tooltip title="Hide Dynamic Labels">
                    <IconButton aria-label='hide-labels' onClick={() => setDynamicLabels(false)}>
                        <LabelOutlinedIcon />
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
                <div
                    onMouseLeave={() => setOptionsDrawer(false)}
                    style={{ height: '100%' }}
                >
                <Box
                    width={{ xs: '10rem', sm: '15rem'}}
                    p={3}
                >
                    <ErasBold pb={2} align='center' fontSize={24}>Graph Options</ErasBold>
                    <Divider />

                    <Box pt={3} sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <Box>
                            <ErasMedium align='center'>Gravity Strength</ErasMedium>
                            <RadioGroup
                                value={gravity}
                                onChange={(event) => setGravity(parseFloat(event.target.value))}
                            >
                                <FormControlLabel
                                    value={0}
                                    control={<Radio color='info' />}
                                    label={<Typography variant='body2'>Zero Gravity (default)</Typography>}
                                />
                                <FormControlLabel
                                    value={0.1}
                                    control={<Radio color='info' />}
                                    label={<Typography variant='body2'>Low Gravity</Typography>}
                                />
                                <FormControlLabel
                                    value={0.5}
                                    control={<Radio color='info' />}
                                    label={<Typography variant='body2'>High Gravity</Typography>}
                                />
                            </RadioGroup>
                            <Typography variant='body2'>
                                Modifies the gravitational strength of the center of the graph.
                            </Typography>
                        </Box>
                        <Box>
                            <ErasMedium align='center'>Node Scalar Size</ErasMedium>
                            <RadioGroup
                                value={nodeSizeScale}
                                onChange={(event) => setNodeSizeScale(parseFloat(event.target.value))}
                            >
                                <FormControlLabel
                                    value={0}
                                    control={<Radio color='info' />}
                                    label={<Typography variant='body2'>Invisible</Typography>}
                                />
                                <FormControlLabel
                                    value={0.25}
                                    control={<Radio color='info' />}
                                    label={<Typography variant='body2'>Extra Small</Typography>}
                                />
                                <FormControlLabel
                                    value={0.5}
                                    control={<Radio color='info' />}
                                    label={<Typography variant='body2'>Small</Typography>}
                                />
                                <FormControlLabel
                                    value={1}
                                    control={<Radio color='info' />}
                                    label={<Typography variant='body2'>Medium (default)</Typography>}
                                />
                                <FormControlLabel
                                    value={1.5}
                                    control={<Radio color='info' />}
                                    label={<Typography variant='body2'>Large</Typography>}
                                />
                                <FormControlLabel
                                    value={2}
                                    control={<Radio color='info' />}
                                    label={<Typography variant='body2'>Extra Large</Typography>}
                                />
                            </RadioGroup>
                            <Typography variant='body2'>Modify the sizes for all nodes.</Typography>
                        </Box>

                    </Box>
                    
                </Box>
                </div>
            </Drawer>
        </Box>
        
    </Box>
    )
}