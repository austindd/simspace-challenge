import React from 'react';
import "./SearchBar.css";
import {DogDataContext} from '.';
import * as O from "fp-ts/Option";

export function SearchBar(
  props: {
    placeholder?: string,
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
  }
) {
  const {onChange, placeholder} = props;
  const {state, dispatch} = React.useContext(DogDataContext);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({tag: "SetSearchTerm", searchTerm: O.some(event.target.value.trim())})
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <div className="search-bar-input-element-wrapper">
      <input className={"search-bar-input-element"} type="search" placeholder={placeholder} onChange={changeHandler}></input>
    </div>
  );
}
