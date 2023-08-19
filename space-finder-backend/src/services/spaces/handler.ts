import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { postSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";
import { updateSpace } from "./UpdateSpace";
import { deleteSpace } from "./DeleteSpace";
import { JSONError, MissingFieldError } from "../shared/Validator";
import { addCORSHeaders } from "../shared/Utils";

const ddbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  let apiResponse: APIGatewayProxyResult;

  try {
    switch (event.httpMethod) {
      case 'GET':
        const getResponse = await getSpaces(event, ddbClient);
        apiResponse = getResponse;
        break;

      case 'POST':
        const postResponse = await postSpaces(event, ddbClient);
        apiResponse = postResponse;
        break;

      case 'PUT':
        const putResponse = await updateSpace(event, ddbClient);
        apiResponse = putResponse;
        break;

      case 'DELETE':
        const deleteResponse = await deleteSpace(event, ddbClient);
        apiResponse = deleteResponse;
        break;

      default:
        break;
    }
  } catch (err) {
    console.error(err);
    if (err instanceof MissingFieldError) {
      return {
        statusCode: 400,
        body: JSON.stringify(err.message)
      }
    }
    if (err instanceof JSONError) {
      return {
        statusCode: 400,
        body: JSON.stringify(err.message)
      }
    }
    return {
      statusCode: 500,
      body: JSON.stringify(err)
    }
  }

  addCORSHeaders(apiResponse);
  return apiResponse;
}

export { handler };
