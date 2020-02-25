const fs = require("fs");
const { google } = require("googleapis");
const dev = process.env.NODE_ENV !== "production";
const { CLIENT_ID, CLIENT_SECRET, TOKEN, AUTH_CODE } = dev
  ? require("../config").creds
  : process.env;
let parsedToken = null;
if (TOKEN) {
  parsedToken = JSON.parse(TOKEN);
}

const SCOPES = [
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/drive.file"
];

if (!CLIENT_ID) {
  console.log("CLIENT_ID env not set. Not uploading to gdrive.\n");
}
if (!CLIENT_SECRET) {
  console.log("CLIENT_SECRET env not set. Not uploading to gdrive.\n");
}
if (!AUTH_CODE) {
  console.log("AUTH_CODE env not set.\n");
}
if (!TOKEN) {
  console.log("TOKEN env not set.\n");
}
if (CLIENT_ID && CLIENT_SECRET && AUTH_CODE && TOKEN) {
  console.log("Gdrive config OK.");
}

async function uploadToDrive(path) {
  if (!CLIENT_ID || !CLIENT_SECRET) return;
  const auth = await authorize();
  if (auth) await uploadFile(auth, path);
}

async function authorize() {
  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    "urn:ietf:wg:oauth:2.0:oob"
  );

  if (!AUTH_CODE) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES
    });
    console.log(`Get AUTH_CODE env by visiting this url: ${authUrl}\n`);
    return null;
  } else if (AUTH_CODE && !TOKEN) {
    return oAuth2Client.getToken(AUTH_CODE, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      console.log("Set TOKEN env to: ", JSON.stringify(token));
      return oAuth2Client;
    });
  } else if (AUTH_CODE && TOKEN) {
    oAuth2Client.setCredentials(parsedToken);
    return oAuth2Client;
  } else {
    console.log("AUTH_CODE:", !!AUTH_CODE);
    console.log("TOKEN:", !!TOKEN);
  }
}

async function uploadFile(auth, path) {
  const drive = google.drive({ version: "v3", auth });
  const intr = path.split("/");
  const name = intr[intr.length - 1];
  console.log(`Uploading file to gdrive: ${name}`);
  var media = {
    body: fs.createReadStream(path)
  };
  drive.files.create(
    {
      resource: { name },
      media: media,
      fields: "id"
    },
    function(err, file) {
      if (err) {
        console.error(err);
      } else {
        console.log(
          `Uploaded ${name} , link: https://drive.google.com/file/d/${file.data.id}/view?usp=sharing`
        );
      }
    }
  );
}

module.exports = uploadToDrive;
