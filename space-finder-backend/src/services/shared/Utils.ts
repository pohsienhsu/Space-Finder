import { APIGatewayProxyEvent } from "aws-lambda";
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

export function hasAdminGroup(event: APIGatewayProxyEvent) {
  const groups = event.requestContext.authorizer?.claims["cognito:groups"];
  if (groups) {
    return (groups as string).includes("admins");
  }
  return false;
}