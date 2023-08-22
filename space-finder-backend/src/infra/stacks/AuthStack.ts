import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
  CfnUserPoolGroup,
  UserPool,
  UserPoolClient,
} from "aws-cdk-lib/aws-cognito";
import {
  Effect,
  FederatedPrincipal,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { IBucket } from "aws-cdk-lib/aws-s3";

interface AuthStackProps extends cdk.StackProps {
  spacePhotosBucket: IBucket
}

export class AuthStack extends cdk.Stack {
  private userPool: UserPool;
  private userPoolClient: UserPoolClient;
  private identityPool: CfnIdentityPool;
  private authenticatedRole: Role;
  private guestRole: Role;
  private adminRole: Role;

  constructor(scope: Construct, id: string, props?: AuthStackProps) {
    super(scope, id, props);

    this.createUserPool();
    this.createUserPoolClient();
    this.createIdentityPool();
    this.createRoles(props.spacePhotosBucket);
    this.attachRoles();
    this.createAdminsGroup();
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
    new CfnUserPoolGroup(this, "SpaceAdmins", {
      userPoolId: this.userPool.userPoolId,
      groupName: "admins",
      roleArn: this.adminRole.roleArn
    });
  }

  private createIdentityPool() {
    this.identityPool = new CfnIdentityPool(this, "SpaceFinderIdentityPool", {
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [
        {
          clientId: this.userPoolClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
        },
      ],
    });

    new cdk.CfnOutput(this, "SpaceFidnerIdentityPoolId", {
      value: this.identityPool.ref,
    });
  }

  private createRoles(spacePhotosBucket: IBucket) {
    this.authenticatedRole = new Role(
      this,
      "Cognito_SpaceFinder_AuthenticatedRole",
      {
        assumedBy: new FederatedPrincipal(
          "cognito-identity.amazonaws.com",
          {
            StringEquals: {
              "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
            },
            "ForAnyValue:StringLike": {
              "cognito-identity.amazonaws.com:amr": "authenticated",
            },
          },
          "sts:AssumeRoleWithWebIdentity"
        ),
      }
    );
    this.guestRole = new Role(this, "Cognito_SpaceFinder_GuestRole", {
      assumedBy: new FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "unauthenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });
    this.adminRole = new Role(this, "Cognito_SpaceFinder_AdminRole", {
      assumedBy: new FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });
    this.adminRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:PutObject", "s3:PutObjectAcl"],
        resources: [spacePhotosBucket.bucketArn + "/*"],
      })
    );
  }

  private attachRoles() {
    new CfnIdentityPoolRoleAttachment(this, "Roles", {
      identityPoolId: this.identityPool.ref,
      roles: {
        'authenticated': this.authenticatedRole.roleArn,
        'unauthenticated': this.guestRole.roleArn,
      },
      roleMappings: {
        adminsMapping: {
          type: 'Token',
          ambiguousRoleResolution: 'AuthenticatedRole',
          identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`,
        }
      }
    });
  }
}
