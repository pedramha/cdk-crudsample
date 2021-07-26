const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';
export const handler = async (event: any={}) : Promise <any> => {

   const item =typeof event.body == 'object' ? event.body :JSON.parse(event.body);
   const ID = String.fromCharCode(65 + Math.floor(Math.random()*26));
   item[PRIMARY_KEY] = ID;
    const params = {
        TableName: TABLE_NAME,
        Item:item
    };

  try {
    await db.put(params).promise();
    return { statusCode: 200, body: 'success' };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError)};
  }
};