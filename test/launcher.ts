import { handler } from "../src/services/spaces/handler";

// process.env.AWS_REGION = 'us-west-2';
// process.env.TABLE_NAME = 'SpacesTable-0aa3b590e49b';

handler(
  {
    httpMethod: "DELETE",
    queryStringParameters: {
      spaceId: "93143f6a-d518-4221-bb8f-b0c99ac1e164",
    },
    // body: JSON.stringify({
    //   location: 'Taiwan updated'
    // })
  } as any,
  {} as any
);