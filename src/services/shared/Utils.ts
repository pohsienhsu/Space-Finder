import { JSONError } from "./Validator";

export function parseJSON(arg: string) {
  try {
    return JSON.parse(arg);
  } catch (err) {
    throw new JSONError(err.message);
  }
}