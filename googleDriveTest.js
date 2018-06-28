var {google}  = require('googleapis');
var drive     = google.drive('v3');
var SCOPES    = ["https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive", 'https://www.googleapis.com/auth/spreadsheets']

var key       = require('./private_key.json');
console.log("Key project data : ", key)

// new JWT({
//   email: "myproject@corded-layout-198106.iam.gserviceaccount.com",
//   key: "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQDKPfOXWOEaj7SD\n9x2if4a4YrQ2UC5Sxia99akxiYARJA2/Awholo/rLIlSELbw24ky4+Q1GgRpXDGn\nwUHyxd//HGKO0XfSXlFcTNREWZNo9H00+dU1SOkFdv9/KyNMsKoZA8hcCby8LF2l\nVAMHUPlvFy/0JjvPXCZFab5rQNKYxHXvcIq9noCZxxHAaQw/sNFinSw2VvSko5mS\nEtVyd5ReS54ZkAso9PLJ3FtxViTepnsRWe9akGc9A7zGEB89mALgJLd7wwuMbtkF\nTviLTLyGoXQsizXDndAjtIjrKyWT1r4SOR2OAInq+KcTH71bUkrbSTv3PQ2+qr61\npz3LZQcFAgMBAAECgf8OS2aYVedaVbRUcf9r6mc+1yc93QlpKIRedDj0cKLW+bbR\ngObL3mEA8vX6qtuYsEa24cKNv7aHlBTMRTY3/2xDLlDrKtqB4G/c5HqIdqo6U102\nipneCZScUooJVSPvRk7K5MTt3pTPOu0k9v/OBgB+7B2HOY1NegysOS9JI/q49l8J\ns+amkHbWnVImk4mc3NRFieitjibmo1tUpcuH1dcpQ9HgAsPICIWex4Onl9LRIAJI\ngQEV8a4vevBwi+2EdUu8Caxy9EzBmM8JK+zm1pd+vhJNJBdPyNtMJWQd7Lmd2ED7\nU1WhPB6Fl7mglKF6IPCyfMfpR4LP9Mx+g0HHQvkCgYEA6nX7fXhD3a839Gl+dCJd\nnkcNV8rqGR6AQEkfs017OxcSaFd0J/B987cZc4Bmv9OcN1mw+X7uhBuf4nF3xGuz\njiCwY948c5LIdG1i1/vnYJvCe+D5J/i2Pif8hUWouloyJcEM7t+ux05hjevZgqOO\nmnKRcO05u1UraDb1EDvHy/0CgYEA3NJAE1qYcQvfJ+RvhBGwnKeH7kd2LkfKqGfG\n/VplsFZ5YV2yUJXKV/+koOCPp44WPVAKccykzZG3Soag1Si1L+s6/ZPbGsYOU3eU\n9VCjJvDpCC54JRl0tnjP1cv1DYAGKb7MD47rl/6X2UitZV4vIFyxqFEUYMGttiUW\nD/nu4akCgYA21TbmxhyhGNxuNcnUIUFhxd4x/Qu4qjB2WGOojGNYk3HDo0hQGudp\n+xVhtNLS5AtxynEgOHZRwSAoVj8bWdDZWX3HLW9X3CkzSW3Hc2tOZb8bN6ctmPYO\nHU3qYTsvse5uc/KxXvDCPeuExHbPHa85Ibgv/9rzm9yV99xiWojEhQKBgQCQYEMW\npFghKXLpITksL2i6s+pzB3QkhDnja562DUGJTrCj0WABwj3+1R1tNgWWtpah1dBO\nYU+rPEeLyYQkei4ku3bhTqel1LKPLhNNZUCW+FJUUBWro/4kQ88XaPe6sObWqnG/\nBmHRCdt8bEE6kp7bWN+rPf/F1zvdaFgJcA8YqQKBgAlV2UyVRxsPv0wdgir3WYZO\nCWO++6BGARqMMIXIw1vpVLaj9F8mv7fjQqgS3jMrkQXPL1Ye/JpKI7YykUiMWKPR\njAFq/Y/ZBtZltrY/Ic+rZ0SgXFd6Hg1d5gfwhpU99YSa8sDUag71LDkOqZLcb/Ge\nbReHhtbtE+66OYd4ocIZ\n-----END PRIVATE KEY-----\n",
//   // key: null,
//   scopes : SCOPES
// }).authorize(function(err, data) {
//   console.log("Error : ", err, " ", data)
// })

var jwtClient = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key,
  SCOPES,
  null
);

var fs   = require('fs')
var dest = fs.createWriteStream('/home/prathamesh/Documents/Built.io/test_app/test.xlsx', "utf8");

jwtClient.authorize(function (err, tokens) {
  if (err) {
    // console.log(err);
    return;
  }

  var sheets = google.sheets("v4")
  sheets.spreadsheets.create({
    auth : jwtClient,
    resource : {
      properties:  {
        "title" : "Pratham Sheet Test",
        "locale" : "en_US"
      },
      sheets : [{
        "properties" : {
          "title" : "Sample Sheet",
          "gridProperties" : {
            "rowCount" : 2,
            "columnCount" : 2
          }
        },
        "data" : [{
          "startRow": 0,
          "startColumn": 0,
          "rowData": [{
            "values" : [{
              "userEnteredValue": {
                "numberValue" : 12
              }
            },{
              "userEnteredValue": {
                "numberValue" : 10
              }
            }]
          }]
        }]
      }]
    }
  }, (err, response) => {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    } else {
        console.log("Added : ", response);
    }
  })

  console.log("JWT Client : ", jwtClient)

  drive.files.export({
    auth : jwtClient,
    fileId : "1dLuJMWm3tbNG8mGieQbFPqG_3rCXvwj_0sX4oA6q3sU",
    // mimeType : "application/vnd.google-apps.spreadsheet"
    mimeType : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  })
  .on('end', function () {
    console.log('Done');
  })
  .on('error', function (err) {
    console.log('Error during download', err);
  })
  .pipe(dest);
});


// let readline             = require('readline');
// let { OAuth2Client, JWT} = require('google-auth-library');

// var {google}             = require('googleapis');
// var drive                = google.drive('v3');

// let SCOPES = ["https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive", 'https://www.googleapis.com/auth/spreadsheets']; //you can add more scopes according to your permission need. But in case you chang the scope, make sure you deleted the ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json file
// const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/'; //the directory where we're going to save the token
// const TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json'; //the file which will contain the token

// var googleAuthenticator = {
//   authenticate : function() {
//     return new Promise(function(resolve, reject) {
      
//       var credentials = googleAuthenticator.getClientSecret()
//       console.log("Secret : ", credentials)
//       return googleAuthenticator.authorize(credentials)
//       .then(function(oAuthClient) {
//         googleAuthenticator.createSampleSheet(oAuthClient)
//       })
//     })
//   },
//   getClientSecret : function() {
//     return require('./credentials.json');
//   },
//   authorize : function(credentials) {
//     var clientSecret = credentials.installed.client_secret;
//     var clientId     = credentials.installed.client_id;
//     var redirectUrl  = credentials.installed.redirect_uris[0];
//     var oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);
//     console.log("auth : ", oauth2Client)

//     return new Promise(function(resolve, reject) {
//       googleAuthenticator.getNewToken(oauth2Client).then(function(oauth2ClientNew) {
//         console.log("Client New : ", oauth2ClientNew)
//         resolve(oauth2ClientNew);
//       }, function(err) {
//         reject(err);
//       });
//     })
//   },
//   getNewToken : function(oauth2Client) {
//     return new Promise((resolve, reject)=>{
//       var authUrl = oauth2Client.generateAuthUrl({
//         access_type: 'offline', // offline gives refresh token whereas online type does not.
//         scope: SCOPES
//       });
//       console.log('Authorize this app by visiting this url: \n ', authUrl);
//       var rl = readline.createInterface({
//         input: process.stdin,
//         output: process.stdout
//       });
//       rl.question('\n\nEnter the code from that page here: ', (code) => {
//         console.log("Code : ", code)
//         rl.close();
//         // Get code from page UI here and generate token for authorization
//         oauth2Client.getToken(code, (err, token) => {
//           if (err) {
//             console.log('Error while trying to retrieve access token', err);
//             reject(err);
//           }

//           // oauth2Client.credentials = token;
//           oauth2Client.setCredentials(token)
//           resolve(oauth2Client);
//         });
//       });
//     });
//   },
//   createSampleSheet : function(oAuthClient) {
//     var sheets = google.sheets("v4")
//     // Refer this link on different types of data to be inserted in Excel cells. https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets#ExtendedValue
//     sheets.spreadsheets.create({
//       auth : oAuthClient,
//       resource : {
//         properties:  {
//           "title" : "Sheet Test",
//           "locale" : "en_US"
//         },
//         sheets : [{
//           "properties" : {
//             "title" : "Sample Sheet",
//             "gridProperties" : {
//               "rowCount" : 2,
//               "columnCount" : 2
//             }
//           },
//           "data" : [{
//             "startRow": 0,
//             "startColumn": 0,
//             "rowData": [{
//               "values" : [{
//                 "userEnteredValue": {
//                   "stringValue" : "Test A"
//                 }
//               },{
//                 "userEnteredValue": {
//                   "stringValue" : "Test B"
//                 }
//               }]
//             },{
//               "values" : [{
//                 "userEnteredValue": {
//                   "numberValue" : 11
//                 }
//               },{
//                 "userEnteredValue": {
//                   "numberValue" : 10
//                 }
//               }]
//             }]
//           }]
//         }]
//       }
//     }, (err, response) => {
//       console.log("Error in creating sheet : ", err, " ", response)
//       if (err) {
//         console.log('The API returned an error: ' + err);
//         return;
//       } else {
//           console.log("Added : ", response);
//       }
//     })
//   }
// }

// module.exports = googleAuthenticator

// oauth2Client.refreshAccessToken((err, tokens) => {
//   // your access_token is now refreshed and stored in oauth2Client
//   // store these new tokens in a safe place (e.g. database)
// });