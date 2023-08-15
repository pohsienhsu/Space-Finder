import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function updateSpace(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (event.queryStringParameters) {
    if (event.queryStringParameters.spaceId && ('spaceId' in event.queryStringParameters) && event.body) {

      const parsedBody = JSON.parse(event.body);
      const spaceId = event.queryStringParameters.spaceId;
      const requestBodyKey = Object.keys(parsedBody)[0];
      const requestBodyValue = parsedBody[requestBodyKey];

      const updateResult = await ddbClient.send(new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: {S: spaceId}
        },
        UpdateExpression: `set #updateKey = :new`,
        ExpressionAttributeValues: {
          ':new': {
            S: requestBodyValue
          }
        },
        ExpressionAttributeNames: {
          '#updateKey': requestBodyKey
        },
        ReturnValues: 'UPDATED_NEW'
      }))
      console.log(JSON.stringify(updateResult));
      return {
        statusCode: 204,
        body: JSON.stringify(updateResult.Attributes)
      }
    }
    return {
      statusCode: 400,
      body: JSON.stringify('Please provide right args!')
    }
  }
}
