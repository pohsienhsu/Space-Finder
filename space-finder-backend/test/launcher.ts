import { handler } from "../src/services/spaces/handler";

// process.env.AWS_REGION = 'us-west-2';
// process.env.TABLE_NAME = 'SpacesTable-0aa3b590e49b';

handler(
  {
    httpMethod: "DELETE",
    queryStringParameters: {
      spaceId: "dd85ce0f-c70b-4c88-93dd-0aeda47e2223",
    },
    headers: {
      Authorization:
        "eyJraWQiOiJFSEtjXC9XVlZSRE5LXC9SbDZjOXRrS1dXbnRJTENUSmgrQTk3RVZOblJCVVU9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiI2ODhhMjZiYS0wMWE1LTQ2OGMtYjhhNS0zNGFmOWJiZGI2YjEiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9Ia0t4M2RKaFoiLCJjb2duaXRvOnVzZXJuYW1lIjoicG9oc3UiLCJvcmlnaW5fanRpIjoiN2U0YjljZTktM2Y0My00OGVjLWJhYWUtMzQ2YWU3MGEwNzQyIiwiYXVkIjoiN2xocTJ1aXQ4cms2NDB1djA2Z3ZzOHA0YnAiLCJldmVudF9pZCI6Ijc1ZTE4N2JjLWFlNDItNDUzNy04MGE2LTJmNTJmOWRjOTI5ZSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjkyMzE4MzE2LCJleHAiOjE2OTIzMjE5MTYsImlhdCI6MTY5MjMxODMxNiwianRpIjoiMWY4YTJmMzEtNGIwOS00MmUzLTg4YjItOWI4NmUwMmNkOTY3IiwiZW1haWwiOiJoYWJvaHN1OTMwQGdtYWlsLmNvbSJ9.BlzX99IZHwTo7vDxSGHwBMyLqgudl2KKjJM03DwRHVD1wtyJtFkkbWNtaWuMGmkA1pggjtSZlccEuaFmNleKRJx6mFRQxEzEBvYMGBu2HVE-iQAuBVDlGeGulhMnCoh0ALX4rc0Cyk9p_e_WCcpMJ-GBKwPzPKNBglq9vNvcMBwjXfT-X5NE4kLC3LRWxDzZ8EgKROifnq3Wn7LqrUzz00rTcM6DPEa2whaW9BjXVzhg_nxC-PTWlNeMOVh09ocX8ypxVMg4uc-Sv6xCVI7E2sZL-07ZaYNxii-QXjd-sSEhjYZxxmF0HTQjJrasu0Ptb5BAK17aZksLssvEJVILNA",
    },
    body: JSON.stringify({
      location: "United States of America",
    }),
  } as any,
  {} as any
).then((result) => {
  console.log(result);
});