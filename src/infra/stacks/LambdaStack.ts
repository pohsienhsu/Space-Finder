import * as cdk from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import {
  Code,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

interface LambdaStackProps extends cdk.StackProps {
  spacesTable: ITable
}

export class LambdaStack extends cdk.Stack {
  public readonly spacesLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const spacesLambda = new NodejsFunction(this, "SpacesLambda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "handler",
      entry: path.join(__dirname, "..", "..", "services", "spaces", "handler.ts"),
      environment: {
        TABLE_NAME: props.spacesTable.tableName
      }
    });

    spacesLambda.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      resources: [props.spacesTable.tableArn],
      actions: [
        "dynamodb:Scan",
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:DeleteItem",
        "dynamodb:UpdateItem",
      ]
    }))

    this.spacesLambdaIntegration = new LambdaIntegration(spacesLambda);
  }
}
