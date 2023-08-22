import * as cdk from "aws-cdk-lib";
import {
  AttributeType,
  Table as DynamoDBTable,
  ITable,
} from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { getSuffixFromStack } from "../Utils";
import {
  Bucket,
  HttpMethods,
  IBucket,
  ObjectOwnership,
} from "aws-cdk-lib/aws-s3";

export class DataStack extends cdk.Stack {

  public readonly spacesTable: ITable;
  public readonly spacePhotosBucket: IBucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const suffix = getSuffixFromStack(this);

    this.spacesTable = new DynamoDBTable(this, "SpacesTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: `SpacesTable-${suffix}`,
    });

    this.spacePhotosBucket = new Bucket(this, "SpacePhotosBucket", {
      bucketName: `space-finder-photos-${suffix}`,
      cors: [
        {
          allowedMethods: [HttpMethods.HEAD, HttpMethods.GET, HttpMethods.PUT],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],
      objectOwnership: ObjectOwnership.OBJECT_WRITER,
      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
    });

    new cdk.CfnOutput(this, "SpaceFinderPhotosBucketName", {
      value: this.spacePhotosBucket.bucketName,
    });
  }
}
