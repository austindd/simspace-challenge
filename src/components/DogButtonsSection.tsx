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
      (list) => {
        if (list.length < 1) {
          return null;
        } else {
          return list.reduce((rows: React.ReactElement[][], breedName) => {
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
          }, [[]]);
        }
      }
    )
  ), [state.selectedBreed, state.breedListMatches]);

  const dogButtonRows =
    dogButtonMatrix?.map((dogButtonRow) => {
      return (
        <div className="dog-buttons-section-row">
          {dogButtonRow}
        </div>
      );
    }) || null;


  const dogButtons = dogButtonRows
    ? dogButtonRows
    : <h2>{"No breed matches found"}</h2>

  console.log({dogButtonRows, dogButtons});

  return (
    <div className="dog-buttons-section">
      <div className="dog-buttons-section-matrix">
        {dogButtons}
      </div>
    </div>
  );
}
