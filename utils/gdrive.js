const fs = require("fs");
const { google } = require("googleapis");
const dev = process.env.NODE_ENV !== "production";
const { CLIENT_ID, CLIENT_SECRET, TOKEN, AUTH_CODE, GDRIVE_PARENT_FOLDER } = dev ? require("../config").creds : process.env;
let parsedToken = null;
if (TOKEN) {
  parsedToken = JSON.parse(TOKEN);
}

const SCOPES = ["https://www.googleapis.com/auth/drive.metadata.readonly", "https://www.googleapis.com/auth/drive.file"];

if (!CLIENT_ID) {
  console.log("CLIENT_ID env not set. Not uploading to gdrive.");
}
if (!CLIENT_SECRET) {
  console.log("CLIENT_SECRET env not set. Not uploading to gdrive.");
}
if (!AUTH_CODE) {
  console.log("AUTH_CODE env not set.");
}
if (!TOKEN) {
  console.log("TOKEN env not set.");
}
if (GDRIVE_PARENT_FOLDER) {
  console.log(`GDRIVE_PARENT_FOLDER set to ${GDRIVE_PARENT_FOLDER}`);
}

let auth = null;
let drive = null;

if (CLIENT_ID && CLIENT_SECRET) {
  authorize().then(a => {
    if (!a) return;
    auth = a;
    drive = google.drive({ version: "v3", auth });
    console.log("Gdrive client up");
  });
}

async function authorize() {
  const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, "urn:ietf:wg:oauth:2.0:oob");

  if (!AUTH_CODE) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES
    });
    console.log(`Get AUTH_CODE env by visiting this url: ${authUrl}\n`);
    return null;
  } else if (AUTH_CODE && !TOKEN) {
    return oAuth2Client.getToken(AUTH_CODE, (err, token) => {
      if (err) {
        console.error("Error retrieving access token\n", err);
        return null;
      }
      oAuth2Client.setCredentials(token);
      if (!TOKEN) console.log("Set TOKEN env to: ", JSON.stringify(token));
      else console.log("Gdrive config OK.");
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

function createFolder(name, parentId) {
  return new Promise((resolve, reject) => {
    var fileMetadata = {
      name, mimeType: "application/vnd.google-apps.folder", parents: parentId ? [parentId] : null
    }; // prettier-ignore
    drive.files.create(
      {
        resource: fileMetadata,
        fields: "id"
      },
      (err, file) => (err ? reject(err) : resolve(file))
    );
  });
}

function uploadFile(name, path, parentId) {
  return new Promise((resolve, reject) => {
    var media = { body: fs.createReadStream(path) };
    drive.files.create(
      { resource: { name, parents: parentId ? [parentId] : null }, media: media, fields: "id" },
      (err, file) => (err ? reject(err) : resolve(file))
    ); // prettier-ignore
  });
}

async function uploadFolder(path, parentId) {
  const intr = path.split("/");
  const name = intr[intr.length - 1];
  if (!fs.existsSync(path)) {
    // Check if path exists
    console.log(`Path ${path} does not exists`);
    return null;
  }

  // make a folder in gdrive
  const folder = await createFolder(name, parentId || GDRIVE_PARENT_FOLDER);
  const folderId = folder.data.id;

  // get list of folders contents
  const contents = fs.readdirSync(path, { withFileTypes: true });
  const uploads = contents.map(val => {
    const name = val.name;
    const isDir = val.isDirectory();
    const isFile = val.isFile();

    // if dir upload dir recursively
    // if file upload the file
    if (isDir) {
      return uploadFolder(`${path}/${name}`, folderId);
    } else if (isFile) {
      return uploadFile(name, `${path}/${name}`, folderId);
    } else {
      return null;
    }
  });

  // await all uploads
  await Promise.all(uploads);

  // return the gdrive link
  return `https://drive.google.com/drive/folders/${folderId}`;
}

async function uploadWithLog(path, parentId) {
  const intr = path.split("/");
  intr[intr.length - 1] = "gdrive.txt";
  const gdriveText = intr.join("/");
  fs.writeFileSync(gdriveText, "Upload started\n");
  const url = await uploadFolder(path, parentId);
  if (url) {
    fs.appendFileSync(gdriveText, `Gdrive url: ${url}`);
    return url;
  } else {
    fs.appendFileSync(gdriveText, `An error occured. GDRIVE_PARENT_FOLDER: ${GDRIVE_PARENT_FOLDER}`);
    return null;
  }
}

module.exports = { uploadFolder, uploadFile, uploadWithLog };
