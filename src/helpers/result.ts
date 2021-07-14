/** This interface is meant to be used as the output of a function
 * which has returned an error and no value.
 */
export interface Failure {
  error: Error;
  value: null;
}

/** This interface is meant to be used as the output of a function
 * which has returned an value and no error.
 */
export interface Success<T> {
  error: null;
  value: T;
}

/** This is a generic interface that describes the output (or ... Result) of
 * a function.
 *
 * A function can either return Success, or Failure.  The intention is to make
 * it clear that both Success and Failure must be considered and handled.
 *
 * Inspired by https://gdelgado.ca/type-safe-error-handling-in-typescript.html#title
 */
export type Result<T> = Success<T> | Failure;

/** create a successful Result;
 *
 * @param value - the value to be passed on, well as the resolved value
 */
export function success<T>(value: T): Result<T> {
  return {
    error: null,
    value,
  };
}

/** creates a failed result
 *
 * @param error - an error; why the returned value did not resolve as expected
 */
export function failure(error: Error): Failure {
  return {
    error,
    value: null,
  };
}
