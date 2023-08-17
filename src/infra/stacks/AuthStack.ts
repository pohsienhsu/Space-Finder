import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";

export class AuthStack extends cdk.Stack {
  private userPool: UserPool;
  private userPoolClient: UserPoolClient;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.createUserPool();
    this.createUserPoolClient();
  }

  private createUserPool() {
    this.userPool = new UserPool(this, "SpaceFinderUserPool", {
      selfSignUpEnabled: true,
      signInAliases: {
        username: true,
        email: true,
      },
      signInCaseSensitive: true,
    });

    new cdk.CfnOutput(this, "SpaceFinderUserPoolId", {
      value: this.userPool.userPoolId,
    });
  }

  private createUserPoolClient() {
    this.userPoolClient = this.userPool.addClient("SpaceFinderUserPoolClient", {
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true,
      },
    });

    new cdk.CfnOutput(this, "SpaceFinderUserPoolClientId", {
      value: this.userPoolClient.userPoolClientId,
    });
  }
}
