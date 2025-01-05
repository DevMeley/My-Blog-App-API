const User = require("../Models/User");
const Post = require("../Models/Post");
const bcrypt = require("bcrypt");

// @desc Update/edit user
// @route PUT /settings/edit
// @access private
const updateUserHandler = async (req, res) => {
  try {
    const user_id = req.user.id;
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      user_id,
      {
        $set: req.body,
      },
      { new: true }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({
      others,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

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
  updateUserHandler,
  deleteUserHandler,
  getUserHandler,
  getProfilehandler,
};
