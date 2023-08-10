import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";




const app = new App();
new DataStack(app, 'SpaceFinderDataStack');
new LambdaStack(app, 'SpaceFinderLambdaStack');