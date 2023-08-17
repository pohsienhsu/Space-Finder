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
import { MissingFieldError } from "../shared/Validator";

const ddbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {

  let message: string;

  try {
    switch (event.httpMethod) {
      case 'GET':
        const getResponse = await getSpaces(event, ddbClient);
        console.log(getResponse);
        return getResponse

      case 'POST':
        const postResponse = await postSpaces(event, ddbClient);
        return postResponse;

      case 'PUT':
        const putResponse = await updateSpace(event, ddbClient);
        return putResponse;

      case 'DELETE':
        const deleteResponse = await deleteSpace(event, ddbClient);
        return deleteResponse;

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
    return {
      statusCode: 500,
      body: JSON.stringify(err)
    }
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(message),
  };
  console.log(event);

  return response;
}

export { handler };
