import {stageFetch} from "../lib/utils";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import {pipe} from "fp-ts/pipeable";
import * as C from "io-ts/Codec";
import * as D from "io-ts/Decoder";

// Environment Variables
const {
  REACT_APP_DOG_API_BASE_URL
} = process.env;

export namespace Url {
  export const BASE_URL = REACT_APP_DOG_API_BASE_URL
  export const breeds_list_all = BASE_URL + "/breeds/list/all"
  export const breed_list = (breed: string) => BASE_URL + "/" + breed + "/list";
  export const breed_images = (breed: string) => BASE_URL + "/breed/" + breed + "/images";
}

export type ApiError = {
  message: string,
  status: "error",
  code: number,
}

export type Message = string | string[] | {[key: string]: string | string[]};

export type ListOfAllBreeds = {
  message: {[key: string]: string[]}
  status: "success",
}

export type SubBreedsOfBreed = {
  message: string[]
  status: "success",
}

export type ImagesOfBreed = {
  message: string[],
  status: "success",
}

export type ApiResponse = ApiError | ListOfAllBreeds | SubBreedsOfBreed | ImagesOfBreed;


export namespace Codecs {
  export const apiError: C.Codec<unknown, ApiError, ApiError> = C.struct({
    message: C.string,
    status: C.literal("error"),
    code: C.number,
  });

  export namespace Success {

    export const listOfAllBreeds: C.Codec<unknown, ListOfAllBreeds, ListOfAllBreeds> = C.struct({
      message: C.record(C.array(C.string)),
      status: C.literal("success"),
    });

    export const subBreedsOfBreed: C.Codec<unknown, SubBreedsOfBreed, SubBreedsOfBreed> = C.struct({
      message: C.array(C.string),
      status: C.literal("success"),
    });

    export const imagesOfBreed: C.Codec<unknown, ImagesOfBreed, ImagesOfBreed> = C.struct({
      message: C.array(C.string),
      status: C.literal("success"),
    });

  }

  export const listOfAllBreeds = C.fromDecoder(D.union(apiError, Success.listOfAllBreeds));
  export const subBreedsOfBreed = C.fromDecoder(D.union(apiError, Success.subBreedsOfBreed));
  export const imagesOfBreed = C.fromDecoder(D.union(apiError, Success.imagesOfBreed));

}

export namespace Get {

  const HEADERS = {
    'Content-Type': 'application/json'
  };

  export const listOfAllBreeds: TE.TaskEither<Error, ListOfAllBreeds> = () => {
    const stagedListOfAllBreeds = stageFetch(Url.breeds_list_all, {
      method: "GET",
      headers: HEADERS,
      body: null
    });
    return stagedListOfAllBreeds().then(E.chain(
      (value) => {
        let result = Codecs.listOfAllBreeds.decode(value);
        let res: E.Either<Error, ListOfAllBreeds> = pipe(
          result,
          E.fold(
            (_) => {
              return E.left(Error("Decode Error: ListOfAllBreeds"))
            },
            (apiResponse) => {
              return (apiResponse.status === "success" ? E.right(apiResponse) : E.left(Error("Api Error: ListOfAllBreeds")))
            },
          )
        )
        return res;
      }
    ));
  }

  export const subBreedsOfBreed: (breed: string) => TE.TaskEither<Error, SubBreedsOfBreed> = (breed: string) => {
    const stagedBreedsOfBreed = stageFetch(Url.breed_list(breed), {
      method: "GET",
      headers: HEADERS,
      body: null,
    });
    return () => {
      return stagedBreedsOfBreed().then(E.chain(
        (value) => {
          let result = Codecs.imagesOfBreed.decode(value);
          let res: E.Either<Error, SubBreedsOfBreed> = pipe(
            result,
            E.fold(
              (_) => {
                return E.left(Error("Decode Error: SubBreedsOfBreed"))
              },
              (apiResponse) => {
                return (apiResponse.status === "success" ? E.right(apiResponse) : E.left(Error("Api Error: SubBreedsOfBreed")))
              },
            )
          )
          return res;
        }
      ));
    };
  }

  export const imagesOfBreed: (breed: string) => TE.TaskEither<Error, ImagesOfBreed> =
    (breed: string) => {
      const stagedSubBreedsOfBreed = stageFetch(Url.breed_images(breed), {
        method: "GET",
        headers: HEADERS,
        body: null,
      });
      return () => {
        return stagedSubBreedsOfBreed().then(E.chain(
          (value) => {
            let result = Codecs.imagesOfBreed.decode(value);
            let res: E.Either<Error, ImagesOfBreed> = pipe(
              result,
              E.fold(
                (_) => {
                  return E.left(Error("Decode Error: ImagesOfBreed"))
                },
                (apiResponse) => {
                  return (apiResponse.status === "success" ? E.right(apiResponse) : E.left(Error("Api Error: ImagesOfBreed")))
                },
              )
            )
            return res;
          }
        ));
      }
    };

}
