import React from 'react';
import "./HomePage.css";
import {DogDataContext} from "./DogDataContext";
import {pipe} from "fp-ts/pipeable";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as Record from "fp-ts/Record";
import {SearchBar, DogButton} from '.';

export const HomePage = () => {
  const {state, dispatch} = React.useContext(DogDataContext);

  console.log("state", state);

  const dogButtons = React.useMemo(() => pipe(
    state.breedListMatches,
    O.fold(
      () => null,
      (list) => list.map((breedName) => {
        return (
          <DogButton onClick={(event) => dispatch({tag: "SetSelectedBreed", selectedBreed: O.some(breedName)})}>
            {breedName}
          </DogButton>
        );
      })
    )
  ), [state]);

  const dogImages = React.useMemo(() => pipe(
    state.selectedBreedImages,
    O.fold(
      () => null,
      (list) => list.map((url) => {
        return (<img key={url} className="homepage-dog-image" src={url}></img>);
      })
    )
  ), [state.selectedBreedImages]);

  return (
    <div>
      <div>
        <SearchBar onChange={(event) => {
          console.log(event.target.value)
          dispatch({tag: "SetSearchTerm", searchTerm: O.some(event.target.value)})
        }} />
      </div>
      <div>
        {dogButtons}
      </div>
      <div>
        {dogImages}
      </div>
    </div>
  );
}

