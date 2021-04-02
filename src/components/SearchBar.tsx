import React from 'react';

export function SearchBar(props: {onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void}) {
  const {onChange} = props;

  return (
    <input type="search" placeholder="search" onChange={onChange}></input>
  )
}
