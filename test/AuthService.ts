import { type CognitoUser } from "@aws-amplify/auth";
import { CognitoIdentityClient, GetCredentialsForIdentityCommand } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { Amplify, Auth } from "aws-amplify";

const awsRegion = "us-west-2";

Amplify.configure({
  Auth: {
    region: awsRegion,
    userPoolId: "us-west-2_HkKx3dJhZ",
    userPoolWebClientId: "7lhq2uit8rk640uv06gvs8p4bp",
    identityPoolId: "us-west-2:e980196a-8622-4baa-821f-402215a3ba18",
    authenticationFlowType: "USER_PASSWORD_AUTH",
  },
});

export class AuthService {
  public async login(userName: string, password: string) {
    const result = (await Auth.signIn(userName, password)) as CognitoUser;
    return result;
  }

  public async generateTemporaryCredentials(user: CognitoUser) {
    const jwtToken = user.getSignInUserSession().getIdToken().getJwtToken();
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/us-west-2_HkKx3dJhZ`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: "us-west-2:e980196a-8622-4baa-821f-402215a3ba18",
        logins: {
          [cognitoIdentityPool]: jwtToken,
        },
      }),
    });
    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }
}

