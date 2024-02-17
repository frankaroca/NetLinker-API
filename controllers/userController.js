const { User, Thought } = require("../models");

module.exports = {
  // Retrieve all existing users
  getUser(req, res) {
    User.find({})
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  // Retrieve only specified user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate("thoughts")
      .populate("friends")
      .select("-__v")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "Cannot locate user with specified ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  
  // Make a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Update an existing user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "Cannot locate user with specified ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Remove a current user
  // For Bonus: Remove a user's associated thoughts as they are deleted
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "Cannot locate user with specified ID" })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: "Both user and thoughts have been deleted" }))
      .catch((err) => res.status(500).json(err));
  },

  // Add a new friend for current user
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "Cannot locate user with specified ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  
  // Delete a friend from user's list
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then(
        (user) =>
          !user
            ? res.status(404).json({ message: "Cannot locate user with specified ID" })
            : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
