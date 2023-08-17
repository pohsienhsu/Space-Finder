import { JSONError } from "./Validator";
import { randomUUID } from "crypto";

export function createRamdonId() {
  return randomUUID();
}

export function parseJSON(arg: string) {
  try {
    return JSON.parse(arg);
  } catch (err) {
    throw new JSONError(err.message);
  }
}