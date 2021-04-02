import React from 'react';

export const DogButton: React.FC<{onClick?: (event: React.MouseEvent) => void}> = ({onClick, children}) => {
  return (<button onClick={onClick}>{children}</button>)
}

