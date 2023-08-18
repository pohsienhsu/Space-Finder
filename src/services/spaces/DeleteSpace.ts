import {
  DeleteItemCommand,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { hasAdminGroup } from "../shared/Utils";

export async function deleteSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {

  if (!hasAdminGroup(event)) {
    return {
      statusCode: 401,
      body: JSON.stringify(`Not authorized!`),
    };
  }

  if (event.queryStringParameters) {
    if (event.queryStringParameters.spaceId && ('spaceId' in event.queryStringParameters)) {
      const spaceId = event.queryStringParameters.spaceId;

      const deleteResult = await ddbClient.send(new DeleteItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: {
            S: spaceId
          }
        }
      }))
      return {
        statusCode: 200,
        body: JSON.stringify(deleteResult.Attributes)
      }
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Invalid query string parameters!'
        })
      }
    }
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid query string parameters!",
      }),
    };
  }
}
