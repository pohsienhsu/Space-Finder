import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { ApiStack } from "./stacks/ApiStack";

const app = new App();
new DataStack(app, "SpaceFinderDataStack");
const lambdaStack = new LambdaStack(app, "SpaceFinderLambdaStack");
new ApiStack(app, "SpaceFinderApiStack", {
  helloLambdaIntegration: lambdaStack.helloLambdaIntegration,
});
