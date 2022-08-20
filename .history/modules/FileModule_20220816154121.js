const multer = require("multer");

const { v4: uuidv4 } = require("uuid");
const firebase = require("../firebase/Firebase");

const file = {};

/**
 *
 * @param {file} file
 * @param {string} path : example 'avatar/'
 * @returns
 */
file.upload_single = (file, path, name) => {
  return new Promise((resolve, reject) => {
    const blob = firebase.bucket.file(path + name + getFileType(file));
    let uuid = uuidv4();

    const blobWriter = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: uuid,
        },
      },
    });

    blobWriter.on("error", (err) => {
      reject(err);
    });

    blobWriter.on("finish", () => {
      resolve(getDonwloadURL(path + name + getFileType(file), uuid));
    });

    blobWriter.end(file.buffer);
  });
};

file.upload_multi = (files, path) => {
  return new Promise((resolve, reject) => {
    var urls = [];
    files.forEach((file, index, array) => {
      var blob = firebase.bucket.file(path + file.originalname);
      let uuid = uuidv4();

      var blobWriter = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
          metadata: {
            firebaseStorageDownloadTokens: uuid,
          },
        },
      });

      blobWriter.on("error", (ignored) => {});

      blobWriter.on("finish", () => {
        urls.push(getDonwloadURL(path + file.originalname, uuid));
        if (index == array.length - 1) resolve(urls);
      });

      blobWriter.end(file.buffer);
    });
  });
};

file.upload_multi_with_index = (files, path) => {
  return new Promise((resolve, reject) => {
    var urls = [];
    var count = 0;

    if (!files || files.length == 0) {
      resolve(urls);
      return;
    }

    files.forEach((file, index, array) => {
      var blob = firebase.bucket.file(path + index + getFileType(file));
      let uuid = uuidv4();

      var blobWriter = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
          metadata: {
            firebaseStorageDownloadTokens: uuid,
          },
        },
      });

      blobWriter.on("error", (ignored) => {
        count += 1;
        if (count == array.length) {
          resolve(urls);
        }
      });

      blobWriter.on("finish", () => {
        urls.push(getDonwloadURL(path + index + getFileType(file), uuid));
        count += 1;
        if (count == array.length) {
          resolve(urls);
        }
      });

      blobWriter.end(file.buffer);
    });
  });
};

file.delete = (path) => {
  return new Promise((resolve, reject) => {
    const bucket = firebase.bucket;
    bucket.deleteFiles(
      {
        prefix: path,
      },
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      }
    );
  });
};

function getDonwloadURL(path, uuid) {
  return `https://firebasestorage.googleapis.com/v0/b/movieapi-fc17b.appspot.com/o/${encodeURIComponent(
    path
  )}?alt=media&token=${uuid}`;
}

function getFileType(file) {
  return "." + file.originalname.split(".").pop();
}
module.exports = file;
