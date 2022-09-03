// MongoDB
import * as Realm from 'realm-web';

async function MongoDBFetchData() {
  // add your Realm App Id to the .env.local file
  const app = await new Realm.App({ id: process.env.REACT_APP_PUBLIC_REALM_APP_ID });
  const credentials = Realm.Credentials.anonymous();
  try {
    const user = await app.logIn(credentials);
    return await user.functions.getAllJobs();
  } catch (error) {
    console.error(error);
    return [];
  }
}

// For Deleting
async function deleteDocument(id) {
  // add your Realm App Id to the .env.local file
  const app = await new Realm.App({ id: process.env.REACT_APP_PUBLIC_REALM_APP_ID });
  const credentials = Realm.Credentials.anonymous();
  try {
    const user = await app.logIn(credentials);
    return await user.functions.deleteDocumentWithObId(id);
  } catch (error) {
    console.error(error);
    return [];
  }
}

// For Updating
async function updateJobWithObId(edit, id) {
  // add your Realm App Id to the .env.local file
  const app = await new Realm.App({ id: process.env.REACT_APP_PUBLIC_REALM_APP_ID });
  const credentials = Realm.Credentials.anonymous();
  try {
    const user = await app.logIn(credentials);
    return await user.functions.updateJobWithObId(edit, id);
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function saveData(data) {
  // add your Realm App Id to the .env.local file
  const app = await new Realm.App({ id: process.env.REACT_APP_PUBLIC_REALM_APP_ID });
  const credentials = Realm.Credentials.anonymous();
  try {
    const user = await app.logIn(credentials);
    return await user.functions.updateJob(data);
  } catch (error) {
    console.error(error);
    return error;
  }
}

async function deleteDocumentIdString(id) {
  // add your Realm App Id to the .env.local file
  const app = await new Realm.App({ id: process.env.REACT_APP_PUBLIC_REALM_APP_ID });
  const credentials = Realm.Credentials.anonymous();
  try {
    const user = await app.logIn(credentials);
    return await user.functions.deleteDocument(id);
  } catch (error) {
    console.error(error);
    return [];
  }
}

export { MongoDBFetchData, deleteDocument, updateJobWithObId, saveData, deleteDocumentIdString };
