import React, { Children, cloneElement, forwardRef, useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Autocomplete, Box, Typography } from '@mui/material';
import { ErasBold, ErasMedium } from './Eras';
import { FixedSizeList as List } from 'react-window';

const ListboxComponent = forwardRef(function ListboxComponent(props, ref) {
  const { children, ...other } = props;
  const itemData = Children.toArray(children);
  const itemCount = itemData.length;
  const itemSize = 36;
  const maxHeight = 7 * itemSize;
  const totalHeight = (itemCount * itemSize);

  const [focused, setFocused] = useState(null);

  return (
    <div ref={ref}>
      <List
        height={Math.min(maxHeight, totalHeight)}
        width={300}
        itemSize={itemSize}
        itemCount={itemCount}
        itemData={itemData}
        {...other}
      >
        {({ data, index, style }) => cloneElement(data[index], {
          style: {
            ...style,
            backgroundColor: focused === index ? '#696969' : 'transparent',
            cursor: 'pointer',
          },
          onMouseEnter: () => setFocused(index),
          onMouseLeave: () => setFocused(null),
        })}
      </List>
    </div>
  );
});

export default ListboxComponent;