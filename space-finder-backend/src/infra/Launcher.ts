import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { ApiStack } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/AuthStack";
import { UIDeploymentStack } from "./stacks/UIDeploymentStack";

const app = new App();
const dataStack = new DataStack(app, "SpaceFinderDataStack");
const lambdaStack = new LambdaStack(app, "SpaceFinderLambdaStack", {
  spacesTable: dataStack.spacesTable,
});
const authStack = new AuthStack(app, "SpaceFinderAuthStack", {
  spacePhotosBucket: dataStack.spacePhotosBucket,
});

new ApiStack(app, "SpaceFinderApiStack", {
  spacesLambdaIntegration: lambdaStack.spacesLambdaIntegration,
  userPool: authStack.getUserPool,
});

new UIDeploymentStack(app, 'SpaceFinderUIDeploymentStack');
