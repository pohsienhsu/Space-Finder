import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";

async function testAuth() {
  const service = new AuthService();
  const loginResult = await service.login(
    "pohsu",
    "Sesame-0530"
  )
  // console.log(loginResult.getSignInUserSession().getIdToken().getJwtToken());

  const credentials = await service.generateTemporaryCredentials(loginResult);
  const buckets = listBuckets(credentials);
  console.log(buckets);
}

async function listBuckets(credentials: any) {
  const s3Client = new S3Client({
    credentials: credentials
  });

  const command = new ListBucketsCommand({});
  const result = await s3Client.send(command);
  return result;
}

testAuth();