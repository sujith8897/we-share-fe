const AWS = require("aws-sdk");
const s3 = new AWS.S3();


const sendResponse = (code, data, message) => {
    return {
        statusCode: code,
        headers: {
            "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({ result: data, message }),
    };
};


const uploadImage = async (fileName) => {
    try {
        if (!fileName) return sendResponse(400, null, "insufficent data!");
        const S3_BUCKET = process.env.ImageBucket;

        var params = { Bucket: S3_BUCKET, Key: fileName };
        var getUrl = await s3.getSignedUrlPromise('putObject', params);
        if (getUrl) return sendResponse(200, getUrl, "Success!");
    }
    catch (e) {
        return sendResponse(400, null, "Failed to Upload Image!");
    }
};

const getImage = async (fileName) => {
    try {
        const S3_BUCKET = process.env.ImageBucket;
        var params = { Bucket: S3_BUCKET, Key: fileName };
        var getImageUrl = await s3.getSignedUrlPromise('getObject', params);
        if (getImageUrl) return sendResponse(200, getImageUrl, "Success!");
    }
    catch (e) {
        return sendResponse(400, null, "Failed to Load Image!");
    }
};



exports.handler = async (event) => {
    const getPath = event["path"];
  const { fileName } = event.queryStringParameters || {};


    switch (getPath) {

        case "/upload_file":
            return uploadImage(fileName);
        case "/get_file":
            return getImage(fileName);

        default:
            return sendResponse(400, "No Valid Path Defined!", "Error")
    }
};
