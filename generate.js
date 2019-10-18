/**
 * This code was based on the Google Quickstart sample for node.js
 * @see https://developers.google.com/sheets/api/quickstart/nodejs
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {google} = require('googleapis');

/**
 * If modifying these scopes, delete token.json.
 * 
 * The file token.json stores the user's access and refresh tokens, and is
 * created automatically when the authorization flow completes for the first
 * time.
 * 
 * The first time you run the sample, it will prompt you to authorize access:
 * Browse to the provided URL in your web browser.
 * 
 * If you are not already logged into your Google account,
 * you will be prompted to log in. If you are logged into multiple
 * Google accounts, you will be asked to select one account to use for the
 * authorization.
 * 
 * Click the Accept button.
 * Copy the code you're given, paste it into the command-line prompt,
 * and press Enter.
 */
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'token.json';

/**
 * Load client secrets from a local file.
 * 
 * To obtain this file go to:
 * @see https://console.developers.google.com/cloud-resource-manager
 * 1 - Create Project
 * 2 - Go to Project Settings
 * 3 - Go to APIs & Services
 * 3.1 - Create Credentials - OAuth client ID
 * 3.2 - Download the file from the in row menu at right of the page and save it
 *       with the name credentials.json and replace on project.
 * 4 - Go to Dashboards
 * 4.1 - Enable APIS AND SERVICES
 * 4.1.1 - Choose Google sheets
 */
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), DownloadSheetData);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url: \n', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Paste the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}


const resourcesDir = path.join(__dirname, 'resources');
const localesFilePath = path.join(resourcesDir, 'locales.json');

/**
 * Download Sheet Data
 * @see https://docs.google.com/spreadsheets/d/1bVqPYL526C26BLIxrO52V_yBaVJwo4PnKKQUFUDGR6o/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function DownloadSheetData(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1bVqPYL526C26BLIxrO52V_yBaVJwo4PnKKQUFUDGR6o',
    range: 'translations!A:Z', //Range can be from min to max, because the API will retrieve only the columns with data.
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      GenerateFiles(rows);
    } else {
      console.log('No data found.');
    }
  });
}

/**
 * Generate locales.json and the respective translation file per locale
 * Save it to resources directory
 */
function GenerateFiles(rows) {
  console.log(`There is ${rows[0].length -1} languages and ${rows.length - 2} translations per language.`);

  var translations = {};
  var localeNames = {};
  
  // The next 3 blocks of code are too confusing....needs a refactor
  rows[0].forEach((name, index) => {
    translations[name] = {};
    localeNames[rows[0][index]] = rows[1][index];
  });

  rows[0].forEach((name) => {
    translations[name]["_comment"] = ["              #####  ########  #######  ########               ","             ##    ##    ##    ##     ## ##     ##             ","             ##          ##    ##     ## ##     ##             ","              ######     ##    ##     ## ########              ","                   ##    ##    ##     ## ##                    ","             ##    ##    ##    ##     ## ##                    ","              ######     ##     #######  ##                    "," THIS FILE IS AUTO-GENERATED ANY MODIFICATION WILL BE OVERRIDED"];
  });

  
  rows.slice(2).forEach(row => {
    const key = row.pop();
    if (key) {
      row.forEach((element, index) => {
        translations[rows[0][index]][key] = element;
      });
    }
  });

  /**
   * Create resources directory
   * 
   * A file locales.json will be written into that directory. This file
   * contains the locales and respective names.
   * 
   * Also save a file per locale with the respective translations
   */
  if (!fs.existsSync(resourcesDir)){
    fs.mkdirSync(resourcesDir);
  }

  fs.writeFileSync(localesFilePath, JSON.stringify(localeNames, null, 2), 'utf-8');
  
  Object.entries(translations).forEach(([key, value]) => {
    fs.writeFileSync(path.join(resourcesDir, key + '.json'), JSON.stringify(value, null, 2), 'utf-8');
  });
}
