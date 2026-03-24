let firebaseAdmin = null;

try {
  firebaseAdmin = require("firebase-admin");
} catch (_error) {
  firebaseAdmin = null;
}

function getFirebasePrivateKey() {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!privateKey) {
    return undefined;
  }

  return privateKey.replace(/\\n/g, "\n");
}

function initializeFirebase() {
  if (!firebaseAdmin) {
    return null;
  }

  if (firebaseAdmin.apps.length > 0) {
    return firebaseAdmin;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = getFirebasePrivateKey();

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });

  return firebaseAdmin;
}

function getFirebaseAdmin() {
  return initializeFirebase();
}

function isFirebaseEnabled() {
  return Boolean(getFirebaseAdmin());
}

module.exports = {
  getFirebaseAdmin,
  isFirebaseEnabled,
};
