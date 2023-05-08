
const { defaultPrefix } = require('../config');
const { getError } = require('./errors');
const cloudinary = require('cloudinary').v2;

const uploadOptions = {
    use_filename: false,
    folder: 'cafe-rio',
}

/**
 * Update the file at the given oldUrl
 * return the url of the new file
 * @param {File} file 
 * @param {String} oldUrl 
 */
async function updateCloudinaryFile(file,oldUrl) {
    try {
        const newUrl = await uploadToCloudinary(file.path);
        deleteFromCloudinary(oldUrl);
        return newUrl;
    }catch(err) {
        throw await getError(err);
    }
}

/**
 * Upload file at the given path to cloudinary
 * @param {String} image 
 */
function uploadToCloudinary(image) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(image, uploadOptions, (err, result) => {
        if (err) return reject(err);
        return resolve(result.url);
      })
    });
  }

  /**
   * Extract the public id from the given cloudinary url
   * @param {String} url 
   */
function getPublicIdFromUrl(url) {
    const publicId = url
    .split('/')
    .slice(-1)[0]
    .split('.')[0];
    return uploadOptions.folder ? uploadOptions.folder.concat('/',publicId) : publicId;
}

/**
 * Delete image from cloudinary
 * unless it's the default image
 * @param {String} imageUrl 
 */
function deleteFromCloudinary(imageUrl) {
    const publicId = getPublicIdFromUrl(imageUrl);
    if (!publicId.includes(defaultPrefix)) {
        cloudinary.uploader.destroy(getPublicIdFromUrl(imageUrl));
    }
}

/**
 * Save all the files in the arguments to cloud storage
 */
async function saveFiles() {
    const files = [...arguments];
    if (!files || !files[0]) return [];
    const fileNames = [];
    try{
        let fileName;
        await asyncForEach(files, async file => {
            fileName = await uploadToCloudinary(file.path);
            fileNames.push(fileName);
        });
        return fileNames.length > 1 ? fileNames : fileNames[0];
    }catch(err){
        throw await getError(err) 
    }
}

/**
 * Replace the file at the oldUrl with the given file
 * return url to the new file
 * @param {File} newFile 
 * @param {String} oldUrl 
 */
async function updateFile(newFile,oldUrl) {
    let newUrl
    try {
        newUrl = await updateCloudinaryFile(newFile,oldUrl);
        return newUrl;
    } catch(err) {
        throw await getError(err);
    }
}

/**
 * Util to handle asynchronous forEach
 * @param {*} array 
 * @param {Function} callback 
 */
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

/**
 * Delete files by file urls
 */
async function deleteFiles() {
    fileUrls = [...arguments]
    if (!fileUrls || !fileUrls[0]) return;
    try{
        fileUrls.forEach(async url => {
            if (typeof url === 'string')
                deleteFromCloudinary(url);
        });
    }catch(err){
        throw await getError(err);
    }
}

module.exports = { saveFiles, deleteFiles, updateFile }