# i8n_generator_google_sheets
Generate language resource files from Google Sheets

## The result
What are expected to see?
A rousources folder with this kind of files:
```bash
kalstong@kalstong-lnx > cd resources
kalstong@kalstong-lnx > ll
 total 36K
 -rw-r--r-- 1 kalstong kalstong 797 nov  4 17:35 de-DE.json
 -rw-r--r-- 1 kalstong kalstong 862 nov  4 17:35 en-US.json
 -rw-r--r-- 1 kalstong kalstong 890 nov  4 17:35 fr-CA.json
 -rw-r--r-- 1 kalstong kalstong 797 nov  4 17:35 gr-GR.json
 -rw-r--r-- 1 kalstong kalstong 255 nov  4 17:35 locales.json
 -rw-r--r-- 1 kalstong kalstong 797 nov  4 17:35 nl-BE.json
 -rw-r--r-- 1 kalstong kalstong 870 nov  4 17:35 pt-PT.json
 -rw-r--r-- 1 kalstong kalstong 797 nov  4 17:35 ru-RU.json
 -rw-r--r-- 1 kalstong kalstong 797 nov  4 17:35 uk-UA.json

 kalstong@kalstong-lnx > less en-US.json
 {
   "_comment": [
     "              #####  ########  #######  ########               ",
     "             ##    ##    ##    ##     ## ##     ##             ",
     "             ##          ##    ##     ## ##     ##             ",
     "              ######     ##    ##     ## ########              ",
     "                   ##    ##    ##     ## ##                    ",
     "             ##    ##    ##    ##     ## ##                    ",
     "              ######     ##     #######  ##                    ",
     " THIS FILE IS AUTO-GENERATED ANY MODIFICATION WILL BE OVERRIDED"
   ],
   "my.sample.placeholder.title": "Hope you enjoy",
   "my.sample.placeholder.message": "Use this code, and modify if you need",
   "my.sample.placeholder.button.close": "Close",
   "my.sample.placeholder.button.sim": "Yes",
   "my.sample.placeholder.button.cancel": "Cancel"
 }
```


## Get Started

``` bash
kalstong@kalstong-lnx > node generate.js

 Authorize this app by visiting this url: 
  https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fspreadsheets.readonly&response_type=code&client_id=268617169795-ilnh2okrq73skni95tva8v6gn8kbhob6.apps.googleusercontent.com& redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob
 Paste the code from that page here: 4/swEJOkz9d90wTihrh1dV-DX8-dwxWeGmzB_bJ3kfHZdvZcYQpV01Svk
 Token stored to token.json
 There is 7 languages and 5 translations per language.

kalstong@kalstong-lnx > cd resources
kalstong@kalstong-lnx > ls
 de-DE.json  en-US.json  fr-CA.json  gr-GR.json  locales.json  nl-BE.json pt-PT.json  ru-RU.json  uk-UA.json

```
If the token.json exists and are valid the the generation will be automatic.

The translations are based on this sample [Google Sheet document](https://docs.google.com/spreadsheets/d/1bVqPYL526C26BLIxrO52V_yBaVJwo4PnKKQUFUDGR6o).
This document have a couple of languages and some placeholders with the respective translations.


## How to setup for my own Google Sheet?

There is a credentials.json that stores the API access to the Google Sheet App.

In order to create that App and that file please follow the next steps.

Go to : https://console.developers.google.com/cloud-resource-manager
 * 1 - Create Project
 * 2 - Go to Project Settings
 * 3 - Go to APIs & Services
 * 3.1 - Create Credentials - OAuth client ID
 * 3.2 - Download the file from the in row menu at right of the page and save it with the name credentials.json and replace on project.
 * 4 - Go to Dashboards
 * 4.1 - Enable APIS AND SERVICES
 * 4.1.1 - Choose Google sheets


