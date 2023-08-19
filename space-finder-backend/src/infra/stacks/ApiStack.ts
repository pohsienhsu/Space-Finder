import * as cdk from "aws-cdk-lib";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  Cors,
  LambdaIntegration,
  MethodOptions,
  ResourceOptions,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { IUserPool } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

interface ApiStackProps extends cdk.StackProps {
  spacesLambdaIntegration: LambdaIntegration;
  userPool: IUserPool;
}

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const api = new RestApi(this, "SpacesAPI");

    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      "SpacesAPIAuthorizer",
      {
        cognitoUserPools: [props.userPool],
        identitySource: "method.request.header.Authorization",
      }
    );
    authorizer._attachToApi(api);

    const optionsWithAuth: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.authorizerId,
      },
    };

    const optionsWithCORS: ResourceOptions = {
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    };

    const spacesResource = api.root.addResource("spaces");
    spacesResource.addMethod(
      "GET",
      props.spacesLambdaIntegration,
      optionsWithAuth
    );
    spacesResource.addMethod(
      "POST",
      props.spacesLambdaIntegration,
      optionsWithAuth
    );
    spacesResource.addMethod(
      "PUT",
      props.spacesLambdaIntegration,
      optionsWithAuth
    );
    spacesResource.addMethod(
      "DELETE",
      props.spacesLambdaIntegration,
      optionsWithAuth
    );
  }
}
