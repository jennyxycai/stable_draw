import React, { useState } from 'react';
import { ButtonGroup, Button } from '@mui/material';

const MyButtonGroup = ({selected, setSelected, select_reset,non_sketch_reset}) => {
  
  console.log(setSelected)
  const handleButtonClick = (index) => {
    setSelected(index);
    if (index == 2)
      select_reset()
    else
      non_sketch_reset()
  };
  const titles = ["Composition", "Generation", "Sketch"]

  return (
    <div style={{
      position: 'absolute',
      zIndex: 10,
      display: 'flex',
      width: '100%',
      height: '100%'
    }}>
      <ButtonGroup style={{ width: '100%' }}>
        {[0, 1, 2].map((index) => (
          <Button
            key={index}
            onClick={() => handleButtonClick(index)}
            style={{
              backgroundColor: selected === index ? 'black' : 'white',
              color: selected === index ? 'white' : 'black',
              fontSize: 'small', 
              padding: '0.5rem',
              flex: 1, // Make buttons flex to fill the container
              outline: 'black'
            }}
          >
             {titles[index]}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default MyButtonGroup;
