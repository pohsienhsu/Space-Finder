import { Stack, StackProps } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { getSuffixFromStack } from "../Utils";
import { existsSync } from "fs";
import path = require("path");
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";


export class UIDeploymentStack extends Stack {
  
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    const deploymentBucket = new Bucket(this, "SpaceFinderUIDeploymentBucket", {
      bucketName: `space-finder-frontend-${suffix}` 
    });

    const uiDir = path.join(__dirname, "..", "..", "..", "..", 'space-finder-frontend', 'dist');
    if (!existsSync(uiDir)) {
      console.warn("UI directory not found: " + uiDir);
      return
    }

    new BucketDeployment(this, 'SpaceFinderUIDeployment', {
      destinationBucket: deploymentBucket,
      sources: [Source.asset(uiDir)]
    })
  }


}