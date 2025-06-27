const User = require("../Models/User")
const cloudinary = require('cloudinary').v2
const dotenv = require("dotenv")

dotenv.config()



cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
        const profilePhoto = await cloudinary.uploader.upload(req.file.path, {
      folder: 'Blog App',
       transformation: [
        { width: 500, height: 300, crop: 'limit' }, 
        { quality: 'auto' } 
      ]
    })
    res.status(200).json({
      success: true,
      url: profilePhoto.secure_url
    })
    } catch (error) {
        res.status(500).json({message: error.message})
    }

}

module.exports = uploadProfilePhoto