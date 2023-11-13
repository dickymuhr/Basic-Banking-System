// SDK initialization

var ImageKit = require("imagekit");

const {
    IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_ENDPOINT
} = process.env

var imagekit = new ImageKit({
    publicKey : IMAGEKIT_PUBLIC_KEY,
    privateKey : IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : IMAGEKIT_ENDPOINT
});