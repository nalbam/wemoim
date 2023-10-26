const fs = require('fs');
const { parse } = require('csv-parse');
const { v4: uuidv4 } = require('uuid');
const async = require('async');
const AWS = require('aws-sdk');

// --- start user config ---

const AWS_CREDENTIALS_PROFILE = 'default';
const DYNAMODB_REGION = 'ap-northeast-2';
const DYNAMODB_TABLENAME = 'wemoim-attendees-dev';

const MOIM_ID = 'demo';

const CSV_FILENAME = `${MOIM_ID}.csv`;

const DEFAULT_track = '트랙 1 DEMO';
const DEFAULT_location = '강남구 테헤란로 데모빌딩 11층';
const DEFAULT_attendance = false;
const DEFAULT_received = false;

// --- end user config ---

const credentials = new AWS.SharedIniFileCredentials({
  profile: AWS_CREDENTIALS_PROFILE
});

AWS.config.credentials = credentials;

const docClient = new AWS.DynamoDB.DocumentClient({
  region: DYNAMODB_REGION
});


function normalizePhone(v) {
  if (!v) return v;
  let cv = v.replace(/[^\d]/g, '');
  if (cv.length + 1 === v.length && v[v.length - 1] === '-') return v;
  if (cv.length < 4) return cv;
  if (cv.length + 2 === v.length && v[v.length - 1] === '-') return v;
  if (cv.length < 8) return `${cv.slice(0, 3)}-${cv.slice(3)}`;
  return `${cv.slice(0, 3)}-${cv.slice(3, 7)}-${cv.slice(7, 11)}`;
}

const rs = fs.createReadStream(CSV_FILENAME);
const parser = parse({
  columns: true,
  delimiter: ','
}, function (err, data) {

  var split_arrays = [],
    size = 25;

  while (data.length > 0) {
    split_arrays.push(data.splice(0, size));
  }

  data_imported = false;
  chunk_no = 1;

  async.each(split_arrays, function (item_data, callback) {
    const params = {
      RequestItems: {}
    };

    params.RequestItems[DYNAMODB_TABLENAME] = [];

    item_data.forEach(item => {
      for (key of Object.keys(item)) {
        // An AttributeValue may not contain an empty string
        if (item[key] === '')
          delete item[key];
      }

      params.RequestItems[DYNAMODB_TABLENAME].push({
        PutRequest: {
          Item: {
            moim_id: MOIM_ID,
            attendee_id: uuidv4(),
            name: item.name,
            email: item.email,
            phone: normalizePhone(item.phone),
            company: item.company,
            answers: '',
            requests: item.requests.toUpperCase(),
            track: DEFAULT_track,
            location: DEFAULT_location,
            attendance: DEFAULT_attendance,
            received: DEFAULT_received,
          }
        }
      });
    });

    console.log(`params ${JSON.stringify(params, null, 2)}`);

    docClient.batchWrite(params, function (err, res, cap) {
      console.log('done going next');
      if (err == null) {
        console.log('Success chunk #' + chunk_no);
        data_imported = true;
      } else {
        console.log(err);
        console.log('Fail chunk #' + chunk_no);
        data_imported = false;
      }
      chunk_no++;
      callback();
    });

  }, function () {
    // run after loops
    console.log('all data imported....');

  });

});

rs.pipe(parser);
