const admin = require("firebase-admin");
const firebaseServiceKey = require("../firebaseServiceKey.json");

// Initialize firebase admin SDK
admin.initializeApp({
  credential: admin.credential.cert(firebaseServiceKey),
  storageBucket: "movieapi-fc17b.appspot.com",
});
// Cloud storage
const bucket = admin.storage().bucket();

module.exports = {
  bucket,
};
