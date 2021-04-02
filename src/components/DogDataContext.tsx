import React from 'react';
import * as Api from "../data/api-data";
import {pipe} from "fp-ts/pipeable";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import * as Record from 'fp-ts/Record';
import {compareLocaleStringAscending} from "../lib/utils"

export type state = {
  listOfAllBreeds: O.Option<string[]>,
  selectedBreed: O.Option<string>,
  selectedBreedSubBreeds: O.Option<string[]>,
  selectedBreedImages: O.Option<string[]>,
  searchTerm: O.Option<string>,
  breedListMatches: O.Option<string[]>,
}

export type SetSearchTerm = {tag: "SetSearchTerm", searchTerm: O.Option<string>}
export type SetSelectedBreed = {tag: "SetSelectedBreed", selectedBreed: O.Option<string>}
export type SetSelectedBreedSubBreeds = {tag: "SetSelectedBreedSubBreeds", selectedBreedSubBreeds: O.Option<string[]>}
export type SetSelectedBreedImages = {tag: "SetSelectedBreedImages", selectedBreedImages: O.Option<string[]>}
export type SetListOfAllBreeds = {tag: "SetListOfAllBreeds", listOfAllBreeds: O.Option<string[]>}
export type SetBreedListMatches = {tag: "SetBreedListMatches", breedListMatches: O.Option<string[]>}
export type ReplaceState = {tag: "ReplaceState", nextState: state}

type internalAction =
  | SetSearchTerm
  | SetSelectedBreed
  | SetSelectedBreedSubBreeds
  | SetSelectedBreedImages
  | SetListOfAllBreeds
  | SetBreedListMatches
  | ReplaceState

export type action =
  | SetSearchTerm
  | SetSelectedBreed

export const reducer = (prevState: state, action: internalAction): state => {
  switch (action.tag) {
    case "SetSearchTerm": {
      return {...prevState, searchTerm: action.searchTerm};
    }
    case "SetSelectedBreed": {
      return {...prevState, selectedBreed: action.selectedBreed};
    }
    case "SetSelectedBreedImages": {
      return {...prevState, selectedBreedImages: action.selectedBreedImages};
    }
    case "SetSelectedBreedSubBreeds": {
      return {...prevState, selectedBreedImages: action.selectedBreedSubBreeds};
    }
    case "SetListOfAllBreeds": {
      return {...prevState, listOfAllBreeds: action.listOfAllBreeds};
    }
    case "SetBreedListMatches": {
      return {...prevState, breedListMatches: action.breedListMatches};
    }
    case "ReplaceState": {
      return action.nextState;
    }
  }
}

export type context = {
  state: state,
  dispatch: React.Dispatch<action>,
}

export const initialState: state = {
  searchTerm: O.none,
  listOfAllBreeds: O.none,
  selectedBreed: O.none,
  selectedBreedSubBreeds: O.none,
  selectedBreedImages: O.none,
  breedListMatches: O.none,
};

const imageUrlCache: Record<string, string[] | undefined> = {}
const subBreedCache: Record<string, string[] | undefined> = {};

const getListOfAllBreeds = (callback: (breedList: string[]) => void) => {
  return Api.Get.listOfAllBreeds().then((result) => {
    return pipe(result,
      E.fold(console.error, ({message}) => {
        const breedList = Object.keys(message);
        breedList.forEach((breedName) => {
          if (!subBreedCache[breedName]) {
            subBreedCache[breedName] = message[breedName];
          }
        });
        callback(breedList);
      })
    )
  });
};

function getFirstTwelveOrLess<a>(list: a[]): a[] {
  const result = list.slice(0, 12);
  return result;
};

function sortAlphabetically(list: string[]) {
  return list.slice().sort(compareLocaleStringAscending);
}

export const DogDataContext: React.Context<context> = React.createContext<context>({
  state: initialState,
  dispatch: (_action) => initialState,
});

export const DogDataProvider: React.FC = ({children}) => {

  const [state, setState] = React.useState(() => initialState);
  const [currentSearchTerm, setCurrentSearchTerm] = React.useState<O.Option<string>>(O.none);
  const [currentSelectedBreed, setCurrentSelectedBreed] = React.useState<O.Option<string>>(O.none);

  console.log({state, currentSearchTerm, currentSelectedBreed, });

  const dispatch = React.useMemo(() => {
    return function (action: action) {
      switch (action.tag) {
        case "SetSearchTerm": {
          return pipe(action.searchTerm,
            O.map(value => {
              if (value === "") {
                setCurrentSearchTerm(O.none)
              } else {
                setCurrentSearchTerm(action.searchTerm);
              }
            })
          )
        }
        case "SetSelectedBreed": {
          return setCurrentSelectedBreed(action.selectedBreed);
        }
      }
    }
  }, [currentSelectedBreed, currentSearchTerm])

  const {listOfAllBreeds} = state;

  React.useEffect(() => {
    if (O.isNone(listOfAllBreeds)) {
      getListOfAllBreeds((breedList) => setState((prevState) => {
        return {
          ...prevState,
          listOfAllBreeds: O.some(breedList),
        }
      }))
    }
  }, [state.listOfAllBreeds]);

  React.useEffect(() => {
    pipe(
      currentSearchTerm,
      O.fold(
        () => {
          setState((prevState) => {
            return {
              ...prevState,
              breedListMatches: pipe(
                listOfAllBreeds,
                O.fold(
                  () => O.none,
                  (breedList) => O.some(getFirstTwelveOrLess(sortAlphabetically(breedList)))
                )
              )
            };
          })
        }, (currentSearchTerm) => {
          pipe(
            listOfAllBreeds,
            O.fold(() => {
              console.warn("ListOfAllBreeds Not Loaded Yet")
              return setState((prevState) => {
                return {
                  ...prevState,
                  searchTerm: O.none,
                };
              });
            }, (breedList) => {
              return setState((prevState) => {
                return {
                  ...prevState,
                  searchTerm: O.some(currentSearchTerm),
                  breedListMatches: O.some(
                    getFirstTwelveOrLess(
                      sortAlphabetically(
                        breedList.filter((breedName) => breedName.includes(currentSearchTerm))
                      )
                    )
                  )
                }
              })
            })
          );
        }
      ))
  }, [currentSearchTerm, state.listOfAllBreeds]);

  React.useEffect(() => {
    pipe(currentSelectedBreed,
      O.fold(() => {
        setState((prevState) => {
          return {
            ...prevState,
            selectedBreedSubBreeds: O.none,
            selectedBreedImages: O.none,
            breedListMatches: O.none,
          };
        })
      }, (selectedBreed) => {
        const maybeImageUrls = imageUrlCache[selectedBreed];
        const maybeSubBreeds = subBreedCache[selectedBreed];

        const nextState: state = {
          ...state,
          selectedBreed: O.some(selectedBreed),
          selectedBreedSubBreeds: maybeSubBreeds ? O.some(maybeSubBreeds) : O.none,
          selectedBreedImages: maybeImageUrls ? O.some(maybeImageUrls) : O.none,
        };

        if (O.isNone(nextState.selectedBreedSubBreeds)) {
          Api.Get.subBreedsOfBreed(selectedBreed)().then((result) => {
            pipe(
              result,
              E.fold(console.error, (response) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    selectedBreedSubBreeds: O.some(response.message)
                  };
                })
              })
            )
          })
        }

        if (O.isNone(nextState.selectedBreedImages)) {
          Api.Get.imagesOfBreed(selectedBreed)().then((result) => {
            pipe(
              result,
              E.fold(console.error, (response) => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    selectedBreedImages: O.some(response.message)
                  };
                })
              })
            );
          });
        }

        return setState(() => nextState);

      })
    );
  }, [currentSelectedBreed]);

  return (<DogDataContext.Provider value={{state, dispatch}}>{children}</DogDataContext.Provider>);
}


