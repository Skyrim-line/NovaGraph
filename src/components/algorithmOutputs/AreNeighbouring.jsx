import { Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { ErasBold } from '../Eras';

const AreNeighbouring = ({ data }) => {
    useEffect(() => {
        console.log(data);
    }, [data]);

    return (<>
        <ErasBold fontSize={20} mb={1}>[{data.source}] → [{data.target}] Adjacency Status</ErasBold>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10 }}>
            <Box>
                <Typography fontSize={15} sx={{ color: data.adjacent ? 'green' : 'red' }}>
                    Nodes ARE {!data.adjacent && "NOT "}adjacent
                </Typography>
                {data.weight && <Typography fontSize={15}>Edge Weight: {data.weight}</Typography>}
            </Box>
        </Box>
    </>);
}

export default AreNeighbouring;