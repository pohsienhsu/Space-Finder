import * as cdk from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as path from "path";

interface LambdaStackProps extends cdk.StackProps {
  spacesTable: ITable
}

export class LambdaStack extends cdk.Stack {
  public readonly helloLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const helloLambda = new LambdaFunction(this, "HelloLambda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "hello.main",
      code: Code.fromAsset(path.join(__dirname, "..", "..", "services")),
      environment: {
        TABLE_NAME: props.spacesTable.tableName
      }
    });

    this.helloLambdaIntegration = new LambdaIntegration(helloLambda);
  }
}
