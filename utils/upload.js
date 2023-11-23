const stream = require('stream');

const authorize = require('../utils/oauth');

const upload = async (file) => {
  const { name, mimeType } = file;
  const service = await authorize('v3');

  const bufferStream = new stream.PassThrough();
  bufferStream.end(file.data);

  const resource = {
    name,
    parents: ['1m6iOiQBWyhx65wU3I4cCebnFAI6v3byi'],
  };

  const media = {
    mimeType,
    body: bufferStream,
  };

  const res = await service.files.create({
    resource,
    media,
    supportsAllDrives: true,
    fields: 'id,webViewLink',
  });

  // return `https://drive.google.com/uc?export=view&id=${res.data.id}`;
  // return res.data.webViewLink;
  return `https://drive.google.com/uc?export=download&id=${res.data.id}`;
};

module.exports = upload;
