import { Button, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import { ErasBold } from '../Eras';
import OutputDialog from './OutputDialog';

const DijkstraSingleSource = ({ data }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        console.log(data);
    }, [data]);

    const handleClick = () => {
        setOpen(!open);
    }

    const loadItems = (paths, records) => {
        return paths.slice(0, records).map((path, index) => (
            <Row key={index}>
                <Cell>{path.target}</Cell>
                <Cell style={{ wordWrap: 'break-word', maxWidth: 250 }}>{path.path.join(' → ')}</Cell>
                <Cell align='center'>{data.weighted ? path.weight : path.path.length}</Cell>
            </Row>
        ));
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Dijkstra's Shortest Path from [{data.source}] to All</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Button variant='contained' color='info' onClick={handleClick}>Details</Button>
            <OutputDialog
                title={`Dijkstra Paths from [${data.source}]`}
                columns={['To', 'Path', data.weighted ? 'Weight' : 'Length']}
                open={open}
                handleClick={handleClick}
                dataArray={data.paths}
                loadItems={loadItems}
            />
        </Box>
    </>);
}

export default DijkstraSingleSource;