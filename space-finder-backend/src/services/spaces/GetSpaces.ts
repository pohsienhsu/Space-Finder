import {
  DynamoDBClient,
  GetItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
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
        const unmarshalledItem = unmarshall(getItemResponse.Item);
        return {
          statusCode: 200,
          body: JSON.stringify(unmarshalledItem)
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

  const scanResult = await ddbClient.send(
    new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })
  );
  const unmarshalledItem = scanResult.Items?.map(item => unmarshall(item));
  console.log(unmarshalledItem);
  return {
    statusCode: 201,
    body: JSON.stringify(unmarshalledItem),
  };
}
