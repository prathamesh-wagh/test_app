let readline             = require('readline');
let { OAuth2Client, JWT} = require('google-auth-library');

var {google}             = require('googleapis');
var drive                = google.drive('v3');

let SCOPES               = ["https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/drive", 'https://www.googleapis.com/auth/spreadsheets']; //you can add more scopes according to your permission need. But in case you chang the scope, make sure you deleted the ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json file
const TOKEN_DIR          = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/'; //the directory where we're going to save the token
const TOKEN_PATH         = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json'; //the file which will contain the token

var oAuthClient = null
var googleAuthenticator = {
  authenticate : function() {
    return new Promise(function(resolve, reject) {
      if(oAuthClient == null) {
        var credentials = googleAuthenticator.getClientSecret()
        return googleAuthenticator.authorize(credentials)
        .then(function(oAuthClient1) {
          oAuthClient = oAuthClient1
          googleAuthenticator.createSampleSheet(oAuthClient)
        })
      }
      
      googleAuthenticator.createSampleSheet(oAuthClient)
    })
  },
  getClientSecret : function() {
    return require('./credentials.json');
  },
  authorize : function(credentials) {
    var clientSecret = credentials.installed.client_secret;
    var clientId     = credentials.installed.client_id;
    var redirectUrl  = credentials.installed.redirect_uris[0];
    var oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);
    console.log("auth : ", oauth2Client)

    return new Promise(function(resolve, reject) {
      googleAuthenticator.getNewToken(oauth2Client).then(function(oauth2ClientNew) {
        console.log("Client New : ", oauth2ClientNew)
        resolve(oauth2ClientNew);
      }, function(err) {
        reject(err);
      });
    })
  },
  getNewToken : function(oauth2Client) {
    return new Promise((resolve, reject)=>{
      var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline', // offline gives refresh token whereas online type does not.
        scope: SCOPES
      });
      console.log('Authorize this app by visiting this url: \n ', authUrl);
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      rl.question('\n\nEnter the code from that page here: ', (code) => {
        console.log("Code : ", code)
        rl.close();
        // Get code from page UI here and generate token for authorization
        oauth2Client.getToken(code, (err, token) => {
          if (err) {
            console.log('Error while trying to retrieve access token', err);
            reject(err);
          }

          // oauth2Client.credentials = token;
          oauth2Client.setCredentials(token)
          resolve(oauth2Client);
        });
      });
    });
  },
  createSampleSheet : function(oAuthClient) {
    var sheets = google.sheets("v4")
    // Refer this link on different types of data to be inserted in Excel cells. https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets#ExtendedValue
    sheets.spreadsheets.create({
      auth : oAuthClient,
      resource : {
        properties:  {
          "title" : "Sheet Test",
          "locale" : "en_US"
        },
        sheets : [{
          "properties" : {
            "title" : "Sample Sheet",
            "gridProperties" : {
              "rowCount" : 5,
              "columnCount" : 3
            }
          },
          "data" : [{
            "startRow": 0,
            "startColumn": 0,
            "rowData": [{
              "values" : [{
                "userEnteredValue": {
                  "stringValue" : "Heading 1"
                }
              },{
                "userEnteredValue": {
                  "stringValue" : "Heading 2"
                }
              },{
                "userEnteredValue" : {
                  "stringValue" : "Heading 3"
                }
              }]
            },{
              "values" : [{
                "userEnteredValue": {
                  "numberValue" : 12
                }
              },{
                "userEnteredValue": {
                  "numberValue" : 10
                }
              }, {
                "userEnteredValue" : {
                  "numberValue" : 15
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
        console.log("Added : ", response.data, "\n", response.data.sheets[0].properties.sheetId)

        sheets.spreadsheets.batchUpdate({
          spreadsheetId : response.data.spreadsheetId,
          auth : oAuthClient,
          "resource" : {
            "requests" : [{
              "updateCells" : {
                "rows" : [{
                  "values" : [{
                    "userEnteredValue": {
                      "numberValue" : 1
                    }
                  },{
                    "userEnteredValue": {
                      "numberValue" : 2
                    }
                  }, {
                    "userEnteredValue" : {
                      "numberValue" : 3
                    }
                  }]
                },{
                  "values" : [{
                    "userEnteredValue": {
                      "numberValue" : 4
                    }
                  },{
                    "userEnteredValue": {
                      "numberValue" : 5
                    }
                  }, {
                    "userEnteredValue" : {
                      "numberValue" : 6
                    }
                  }]
                },{
                  "values" : [{
                    "userEnteredValue": {
                      "numberValue" : 7
                    }
                  },{
                    "userEnteredValue": {
                      "numberValue" : 8
                    }
                  }, {
                    "userEnteredValue" : {
                      "numberValue" : 9
                    }
                  }]
                }],
                "fields" : "*",
                "start" : {
                  "sheetId" : response.data.sheets[0].properties.sheetId,
                  "rowIndex" : 2,
                  "columnIndex" : 0
                }
              }
            }]
          }
        }, function(err, response) {
          if(err) {
            console.log("Error : ", err)
            return err;
          } else {
            console.log("Response : ", response)
          }
        })
      }
    })
  }
}

module.exports = googleAuthenticator