import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function getSpaces(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (event.queryStringParameters) {
    if ("spaceId" in event.queryStringParameters) {
      const spaceId = event.queryStringParameters.spaceId;
      const getItemResponse = await ddbClient.send(
        new GetItemCommand({
          TableName: process.env.TABLE_NAME,
          Key: {
            id: { S: spaceId },
          },
        })
      );
      if ((getItemResponse).Item) {
        return {
          statusCode: 200,
          body: JSON.stringify(getItemResponse.Item)
        }
      } else {
        return {
          statusCode: 401,
          body: JSON.stringify(`space with id: ${spaceId} not found!`),
        };
      }
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify("Id required"),
      };
    }
  }

  const result = await ddbClient.send(
    new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })
  );
  console.log(result.Items);
  return {
    statusCode: 201,
    body: JSON.stringify(result.Items),
  };
}
