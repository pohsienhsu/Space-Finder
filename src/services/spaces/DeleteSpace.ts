import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function deleteSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
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
