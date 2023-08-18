import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { CfnIdentityPool, CfnUserPoolGroup, UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";

export class AuthStack extends cdk.Stack {

  private userPool: UserPool;
  private userPoolClient: UserPoolClient;
  private identityPool: CfnIdentityPool;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.createUserPool();
    this.createUserPoolClient();
    this.createAdminsGroup();
    this.createIdentityPool();
  }

  get getUserPool() {
    return this.userPool;
  }

  get getUserPoolClient() {
    return this.userPoolClient;
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

  private createAdminsGroup() {
    new CfnUserPoolGroup(this, 'SpaceAdmins', {
      userPoolId: this.userPool.userPoolId,
      groupName: "admins",
    })
  }

  private createIdentityPool() {
    this.identityPool = new CfnIdentityPool(this, "SpaceFinderIdentityPool", {
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [{
        clientId: this.userPoolClient.userPoolClientId,
        providerName: this.userPool.userPoolProviderName
      }]
    })

    new cdk.CfnOutput(this, 'SpaceFidnerIdentityPoolId', {
      value: this.identityPool.ref
    })
  }
}
