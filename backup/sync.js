const async = require('async');
const AWS = require('aws-sdk');

// --- start user config ---

const AWS_CREDENTIALS_PROFILE = 'default';
const DYNAMODB_REGION = 'ap-northeast-2';
const DYNAMODB_TABLENAME = 'wemoim-attendees-dev';

// --- end user config ---

const credentials = new AWS.SharedIniFileCredentials({
  profile: AWS_CREDENTIALS_PROFILE
});

AWS.config.credentials = credentials;

const docClient = new AWS.DynamoDB.DocumentClient({
  region: DYNAMODB_REGION
});

const FROM_MOIM_ID = 'cday-2023-track3';
const TO_MOIM_ID = 'cday-2023-handson';

/**
 * DYNAMODB_TABLENAME 의 키는 moim_id, email 이다.
 * DYNAMODB_TABLENAME 에서 FROM_MOIM_ID 에 해당하는 모임의 모든 참가자를 가져온다. (attendees1)
 * 참가자의 attendance == true 인 경우,
 * DYNAMODB_TABLENAME TO_MOIM_ID 에 해당하는 참가자 중 email 이 같은 참가자를 조회해서, (attendees2)
 * phone 도 같으면, 참가자의 received 를 true 로 변경한다.
 */
function main() {
  const params = {
    TableName: DYNAMODB_TABLENAME,
    KeyConditionExpression: 'moim_id = :moim_id',
    ExpressionAttributeValues: {
      ':moim_id': FROM_MOIM_ID
    }
  };

  docClient.query(params, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      const attendees1 = data.Items;
      console.log('attendees1.length: ', attendees1.length);

      const attendees2 = [];
      async.eachSeries(attendees1, function (attendee1, callback) {
        if (attendee1.attendance) {
          const params = {
            TableName: DYNAMODB_TABLENAME,
            KeyConditionExpression: 'moim_id = :moim_id and email = :email',
            ExpressionAttributeValues: {
              ':moim_id': TO_MOIM_ID,
              ':email': attendee1.email
            }
          };

          docClient.query(params, function (err, data) {
            if (err) {
              console.log(err);
            } else {
              const attendee2 = data.Items[0];
              if (attendee2) {
                if (attendee1.phone === attendee2.phone) {
                  attendee2.received = true;
                  attendees2.push(attendee2);
                }
              }
              callback();
            }
          });
        } else {
          callback();
        }
      }, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('attendees2.length: ', attendees2.length);

          async.eachSeries(attendees2, function (attendee2, callback) {
            const params = {
              TableName: DYNAMODB_TABLENAME,
              Key: {
                'moim_id': attendee2.moim_id,
                'email': attendee2.email
              },
              UpdateExpression: 'set received = :received',
              ExpressionAttributeValues: {
                ':received': attendee2.received
              }
            };

            docClient.update(params, function (err, data) {
              if (err) {
                console.log(err);
              } else {
                console.log('updated: ', attendee2.email);
              }
              callback();
            });
          }, function (err) {
            if (err) {
              console.log(err);
            } else {
              console.log('done');
            }
          });
        }
      });
    }
  });
}

main();
