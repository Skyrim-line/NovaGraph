import { Button, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { RTableCell as Cell, RTableRow as Row } from './ResultsTable';
import { ErasBold } from '../Eras';
import OutputDialog from './OutputDialog';

const Yen = ({ data }) => {
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
                <Cell>{index + 1}</Cell>
                <Cell>{path.path.join(' → ')}</Cell>
                <Cell>{data.weighted ? path.weight : path.path.length}</Cell>
            </Row>
        ));
    }

    return (<>
        <ErasBold fontSize={20} mb={1}>Yens's k Shortest Paths from [{data.source}] to [{data.target}]</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Typography fontSize={15}>Paths found: {data.paths ? data.paths.length : 0}/{data.k}</Typography>
            <Button variant='contained' color='info' onClick={handleClick}>Details</Button>
            <OutputDialog
                title={`k=${data.k} Paths from [${data.source}] to [${data.target}]`}
                columns={['#', 'Path', data.weighted ? 'Weight' : 'Length']}
                open={open}
                handleClick={handleClick}
                dataArray={data.paths}
                loadItems={loadItems}
            />
        </Box>
    </>);
}

export default Yen;