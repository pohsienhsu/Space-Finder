import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";
import { validateAsSpaceEntry } from "../shared/Validator";
import { createRamdonId, parseJSON } from "../shared/Utils";

export async function postSpaces(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    
  const randomId = createRamdonId();
  const item = parseJSON(event.body);
  item.id = randomId;
  validateAsSpaceEntry(item);

  const result = await ddbClient.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: marshall(item),
  }))
  console.log(result);
  return {
    statusCode: 201,
    body: JSON.stringify({id: randomId})
  }
}
