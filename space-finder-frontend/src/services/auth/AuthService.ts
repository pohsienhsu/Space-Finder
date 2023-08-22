import { type CognitoUser } from "@aws-amplify/auth";
import { Amplify, Auth } from "aws-amplify";
import { SpaceFinderAuthStack } from "../../../../space-finder-backend/outputs.json";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const awsRegion = "us-west-2";

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: awsRegion,
    userPoolId: SpaceFinderAuthStack.SpaceFinderUserPoolId,
    userPoolWebClientId: SpaceFinderAuthStack.SpaceFinderUserPoolClientId,
    identityPoolId: SpaceFinderAuthStack.SpaceFinderIdentityPoolId,
    authenticationFLowType: "USER_PASSWORD_AUTH",
  },
});

export class AuthService {
  private user: CognitoUser | undefined;
  private jwtToken: string | undefined;
  private temporaryCredentials: object | undefined;

  public async login(
    username: string,
    password: string
  ): Promise<CognitoUser | undefined> {
    try {
      this.user = (await Auth.signIn(username, password)) as CognitoUser;
      this.jwtToken = this.user
        ?.getSignInUserSession()
        ?.getIdToken()
        .getJwtToken();
      return this.user;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }

  public getUsername() {
    return this.user?.getUsername();
  }

  public async getTemporaryCredentials() {
    if (this.temporaryCredentials) {
      return this.temporaryCredentials;
    } else {
      this.temporaryCredentials = await this.generateTemporaryCredentials();
      return this.temporaryCredentials;
    }
  }

  private async generateTemporaryCredentials() {
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/${SpaceFinderAuthStack.SpaceFinderUserPoolId}`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        clientConfig: {
          region: awsRegion,
        },
        identityPoolId: SpaceFinderAuthStack.SpaceFinderIdentityPoolId,
        logins: {
          [cognitoIdentityPool]: this.jwtToken!,
        },
      }),
    });
    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }
}
