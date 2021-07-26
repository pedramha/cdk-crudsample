import cdk = require("@aws-cdk/core");
import apigateway = require("@aws-cdk/aws-apigateway");
import dynamodb = require("@aws-cdk/aws-dynamodb");
import lambda = require("@aws-cdk/aws-lambda");
import { RemovalPolicy } from "@aws-cdk/core";
import { create } from "domain";
import { BillingMode } from "@aws-cdk/aws-dynamodb";


export class CdkCrudStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    //dynamodb
    const dynmoTable=new dynamodb.Table(this,'mytestDB',{
      partitionKey:{
        name:'itemId',
        type:dynamodb.AttributeType.STRING
      }
    });

    //lambda
    const getAll = new lambda.Function(this, 'getAllitems',{
      code: new lambda.AssetCode('./src'),
      handler:'get-all.handler',
      runtime:lambda.Runtime.NODEJS_10_X,
      environment:{
        TABLE_NAME: dynmoTable.tableName,
        PRIMARY_KEY:'itemId'
      }
    });

    const createLambda = new lambda.Function(this, 'createItem',{
      code: new lambda.AssetCode('./src'),
      handler:'create.handler',
      runtime:lambda.Runtime.NODEJS_10_X,
      environment:{
        TABLE_NAME: dynmoTable.tableName,
        PRIMARY_KEY:'itemId'
      },
    });


    dynmoTable.grantReadData(getAll);
    dynmoTable.grantReadWriteData(createLambda);

    //apigateway
    const api = new apigateway.RestApi(this,' testApi',{
      restApiName:'my test api'
    });
    const rootApi=api.root.addResource('root');
    const getAllApi=new apigateway.LambdaIntegration(getAll);
    rootApi.addMethod('GET',getAllApi);

    const createApi=rootApi.addResource('create');
    const createApiIntegration=new apigateway.LambdaIntegration(createLambda);
    createApi.addMethod('POST', createApiIntegration);

    const plan = api.addUsagePlan('UsagePlan', {
      name:'EASY',
      throttle:{
        rateLimit:20,
        burstLimit:2
      }
    });
    const key =api.addApiKey('ApiKey');
    plan.addApiKey(key);

    // cdk bootstrap aws://youraccountID/eu-central-1

    // set CDK_NEW_BOOTSTRAP=1
    // cdk bootstrap aws://youraccountID/eu-central-1
  }
}
