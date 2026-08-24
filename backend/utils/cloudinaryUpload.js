const cloudinary = require('../config/cloudinary');

const streamUpload = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(buffer);
  });
};

exports.uploadImageBuffer = async (buffer, folder = 'urbanthread/products') => {
  const result = await streamUpload(buffer, folder);
  return { url: result.secure_url, publicId: result.public_id };
};

exports.deleteImage = async (publicId) => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};
