const User = require("../Models/User");
const Post = require("../Models/Post");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



// @desc Update/edit user
// @route PUT /settings/edit
// @access private
const updateProfilePics = async (req, res) => {
   try {
      const userId = req.user.id; // Assuming you have authentication middleware
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      // Find user and get old profile pic URL if exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Upload to Cloudinary
      const profilePhoto = await cloudinary.uploader.upload(req.file.path, {
        folder: 'user-profiles',
        width: 300,
        height: 300,
        crop: 'fill',
        quality: 'auto'
      });

      // Delete old profile picture from Cloudinary if it exists
      if (user.profilePics) {
        try {
          // Extract public_id from the URL
          const urlParts = user.profilePics.split('/');
          const publicIdWithExtension = urlParts[urlParts.length - 1];
          const publicId = publicIdWithExtension.split('.')[0];
          await cloudinary.uploader.destroy(`user-profiles/${publicId}`);
        } catch (error) {
          console.log('Error deleting old image:', error);
          // Continue with update even if deletion fails
        }
      }

      // Update user with new profile picture URL
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePics: profilePhoto.secure_url },
        { new: true, select: '-password' }
      );

      res.status(200).json({
        success: true,
        message: 'Profile picture updated successfully',
        data: {
          profilePic: updatedUser.profilePics,
          username: updatedUser.username,
          email: updatedUser.email
        }
      });


  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateUsernameHadler = async (req, res) => {
  try {
    const userId = req.user.id;
      const { username } = req.body;

      // Validate username
      if (!username || username.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Username is required'
        });
      }

      if (username.length < 3 || username.length > 20) {
        return res.status(400).json({
          success: false,
          message: 'Username must be between 3 and 20 characters'
        });
      }

      // Check if username already exists (excluding current user)
      const existingUser = await User.findOne({ 
        username: username.trim(),
        _id: { $ne: userId }
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Username already taken'
        });
      }

      // Update username only
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { username: username.trim() },
        { new: true, select: '-password' }
      );

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Username updated successfully',
        data: {
          username: updatedUser.username,
          email: updatedUser.email,
          profilePic: updatedUser.profilePics
        }
      });
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

// @desc delete user
// @oute DELETE /account/delete
// @access private
const deleteUserHandler = async (req, res) => {
  try {
    const user_id = req.user.id;

    await Post.deleteMany({ username: user_id.username });
    const deleteUser = await User.findByIdAndDelete(user_id);
    res.status(200).json({
      deleteUser,
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc get user accout
// @oute GET /settings/account/
// @access private
const getUserHandler = async (req, res) => {
  try {
    const user_id = req.user.id;
    const getUser = await User.findById(user_id);

    const { password, ...others } = getUser._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc get profile
const getProfilehandler = async (req, res) => {
  try {
    const username = req.params;
    const profile = await User.findOne(username);
    res.status(200).json({ profile });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  updateProfilePics,
  deleteUserHandler,
  updateUsernameHadler,
  getUserHandler,
  getProfilehandler,
};
