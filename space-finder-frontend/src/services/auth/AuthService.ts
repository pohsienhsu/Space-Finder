import { type CognitoUser } from "@aws-amplify/auth";
import { Amplify, Auth } from "aws-amplify";
import { SpaceFinderAuthStack } from "../../../../space-finder-backend/outputs.json";

const awsRegion = "us-west-2";

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: awsRegion,
    userPoolId: SpaceFinderAuthStack.SpaceFinderUserPoolId,
    userPoolWebClientId: SpaceFinderAuthStack.SpaceFinderUserPoolClientId,
    identityPoolId: SpaceFinderAuthStack.SpaceFidnerIdentityPoolId,
    authenticationFLowType: "USER_PASSWORD_AUTH",
  },
});

export class AuthService {

  private user: CognitoUser | undefined;

  public async login(
    username: string,
    password: string
  ): Promise<CognitoUser | undefined> {
    try {
      this.user = await Auth.signIn(username, password) as CognitoUser;
      return this.user;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }

  public getUsername() {
    return this.user?.getUsername();
  }
}
