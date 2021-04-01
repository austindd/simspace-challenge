import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";
import {pipe} from "fp-ts/pipeable";

export const tryCatch: <a>(thunk: () => a) => E.Either<Error, a> = <a>(thunk: () => a) => {
  try {
    const a = thunk();
    return E.right(a);
  } catch (err) {
    if (!!err && typeof err === "object" && err instanceof Error) {
      return E.left(err)
    } else {
      return E.left(Error())
    }
  }
}

export const promiseToTaskEither = <a>(promise: Promise<a>): TE.TaskEither<Error, a> => {
  return () => promise
    .then(E.right)
    .catch((err) => {
      if (!!err && typeof err === "object" && err instanceof Error) {
        return E.left(err);
      } else {
        return E.left(Error("Promise Failure"));
      }
    })
};

export const stageFetch = (url: string, requestInit: RequestInit): TE.TaskEither<Error, unknown> => {
  return pipe(
    window.fetch(url, requestInit),
    promiseToTaskEither,
    TE.chain((response: Response) => {
      if (response.ok) {
        return promiseToTaskEither(response.json())
      } else {
        return promiseToTaskEither(Promise.reject(response))
      }
    })
  );
}

