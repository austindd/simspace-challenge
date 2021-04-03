import React from "react";
import {DogDataContext} from ".";
import "./DogButtonsSection.css";
import {pipe} from "fp-ts/pipeable";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as Record from "fp-ts/Record";
import {DogButton} from '.';

export const DogButtonsSection: React.FC = () => {

  const {state, dispatch} = React.useContext(DogDataContext);

  console.log(state);

  const dogButtonMatrix = React.useMemo(() => pipe(
    state.breedListMatches,
    O.fold(
      () => null,
      (list) => list.reduce((rows: React.ReactElement[][], breedName) => {
        const dogButton = (
          <DogButton
            selected={
              pipe(
                state.selectedBreed,
                O.fold(
                  () => false,
                  (selectedBreed) => {
                    return selectedBreed === breedName
                  }
                )
              )}
            onClick={(_event) => dispatch({tag: "SetSelectedBreed", selectedBreed: O.some(breedName)})}
          >
            {breedName}
          </DogButton>
        );
        const currentRowIndex = rows.length - 1;
        const currentRow = rows[currentRowIndex];
        if (currentRow.length >= 4) {
          const nextRowIndex = currentRowIndex + 1;
          const nextRow: React.ReactElement[] = [];
          rows[nextRowIndex] = nextRow;
          nextRow.push(dogButton);
        } else {
          currentRow.push(dogButton)
        }
        return rows;
      }, [[]])
    )
  ), [state.selectedBreed, state.breedListMatches]);

  const dogButtonElements = dogButtonMatrix?.map((dogButtonRow) => {
    return (
      <div className="dog-buttons-section-row">
        {dogButtonRow}
      </div>
    );
  });

  return (
    <div className="dog-buttons-section">
      <div className="dog-buttons-section-matrix">
        {dogButtonElements}
      </div>
    </div>
  );
}
