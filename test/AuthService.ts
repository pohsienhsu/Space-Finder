import { type CognitoUser } from "@aws-amplify/auth";
import { Amplify, Auth } from "aws-amplify";
import { Fn } from "aws-cdk-lib";

const awsRegion = "us-west-2";

Amplify.configure({
  Auth: {
    region: awsRegion,
    userPoolId: "us-west-2_HkKx3dJhZ",
    userPoolWebClientId: "7lhq2uit8rk640uv06gvs8p4bp",
    authenticationFlowType: "USER_PASSWORD_AUTH",
  },
});

export class AuthService {
  public async login(username: string, password: string) {
    const result = await Auth.signIn(username, password) as CognitoUser;
    return result;
  }
}

