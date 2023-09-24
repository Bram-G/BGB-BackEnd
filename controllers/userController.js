const express = require("express");
const cors = require("cors"); // Import the CORS middleware
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// TODO add session checkers on applicable routes
// TODO add password encryption & JWT
// TODO add follow & unfollow functions

const app = express();

// Allow requests from http://localhost:3000 for all routes in this controller
const corsOptions = {
  origin: "http://localhost:3000",
};

// Add the CORS middleware for all routes in this controller
app.use(cors(corsOptions));

module.exports = {
  // get all users
  getUsers(req, res) {
    User.find({})
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  //login user
  logUserIn(req, res) {
    User.findOne({ username: req.body.username })
      .then((foundUser) => {
        if (!foundUser) {
          return res.status(401).json({ msg: "wrong username" });
        }

        if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
          return res.status(401).json({ msg: "wrong password" });
        }
        // if(req.body.password !== foundUser.password){
        //   return res.status(401).json({ msg: "wrong password" });
        // }

        const token = jwt.sign(
          {
            id: foundUser._id,
            username: foundUser.username,
          },
          "Butler",
          {
            expiresIn: "6h",
          }
        );
        // console.log(token);
        return res.json({
          msg: "successfully logged in",
          token: token,
          user: foundUser,
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({ msg: "an error has occured" });
      });
  },

  // get user by token
  isValidToken(req, res) {
    console.log(req.headers.authorization);
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(403).json({
        isValid: false,
        msg: "ERR, you must be logged to perform this action.",
      });
    }
    try {
      const tokenData = jwt.verify(token, "Butler");
      res.json({
        msg: "success",
        isValid: true,
        user: tokenData,
      });
    } catch (err) {
      res.status(403).json({
        isValid: false,
        msg: "invalid token",
      });
    }
  },

  // get single user
  getSingleUser(req, res) {
    User.findOne({ username: req.params.username })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that username" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new user
  createUser(req, res) {
    const { username, email, password } = req.body;

    // Check if a user with the same username or email already exists
    User.findOne({ $or: [{ username }, { email }] })
      .then((existingUser) => {
        if (existingUser) {
          // User already exists, send a 409 Conflict response
          return res.status(409).json({ message: "User already exists" });
        } else {
          // Create a new user
          User.create({ username, email, password })
            .then((user) => {
              // User created successfully, send a 200 OK response
              return res.status(200).json({ message: "User created", user });
            })
            .catch((err) => {
              // Handle any database-related errors
              return res.status(500).json({ error: err.message });
            });
        }
      })
      .catch((err) => {
        // Handle any database-related errors
        return res.status(500).json({ error: err.message });
      });
  },

  // update user
  updateUser(req, res) {
    User.findOneAndUpdate({ username: req.params.username }, req.body, {
      new: true,
    }).then((user) => res.json(user));
  },

  // delete user
  deleteUser(req, res) {
    User.findOneAndDelete({ username: req.params.username })
      .then((dbUserData) =>
        res.json({ msg: `successfully deleted user ${dbUserData.username}` })
      )
      .catch((err) => res.status(500).json(err));
  },

  addGamesToCollection(req, res) {
    const gameIds = req.body.gameIds; // Assuming you pass an array of game IDs in the request body
    const userId = req.params.userId;

    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        if (!Array.isArray(gameIds)) {
          console.log(gameIds);
          return res
            .status(400)
            .json({ message: "Invalid input. Expecting an array of gameIds." });
        }

        // Create a Set to store unique game IDs
        const uniqueGameIds = new Set(gameIds);

        // Filter out game IDs that are already in the user's collection
        const newGameIds = [...uniqueGameIds].filter(
          (gameId) => !user.bg_collection.includes(gameId)
        );

        // Add the new game IDs to the user's collection
        user.bg_collection.push(...newGameIds);

        // Save the updated user object
        return user
          .save()
          .then((updatedUser) => {
            res.json(updatedUser);
          })
          .catch((err) => {
            console.error("Error saving user:", err);
            res.status(500).json(err);
          });
      })
      .catch((err) => {
        console.error("Error finding user:", err);
        res.status(500).json(err);
      });
  },

  addGameToCollection(req, res) {
    const gameId = req.body.gameId; // Assuming you pass user ID and game ID as parameters
    console.log(gameId);
    const userId = req.params.userId;

    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        if (gameId == null) {
          return res.status(404).json({ message: "null trying to be added" });
        }

        // Push the gameId to the bg_collection array
        user.bg_collection.push(gameId);

        // Save the updated user object
        return user
          .save()
          .then((updatedUser) => {
            res.json(updatedUser);
          })
          .catch((err) => {
            console.error("Error saving user:", err);
            res.status(500).json(err);
          });
      })
      .catch((err) => {
        console.error("Error finding user:", err);
        res.status(500).json(err);
      });
  },

  // Remove a game from the user's collection
  removeGameFromCollection(req, res) {
    const gameId = req.body.gameId; // Assuming you pass user ID and game ID as parameters
    const userId = req.params.userId;

    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        if (gameId == null) {
          return res.status(404).json({ message: "null trying to be removed" });
        }

        // Push the gameId to the bg_collection array
        user.bg_collection.pull(gameId);

        // Save the updated user object
        return user
          .save()
          .then((updatedUser) => {
            res.json(updatedUser);
          })
          .catch((err) => {
            console.error("Error saving user:", err);
            res.status(500).json(err);
          });
      })
      .catch((err) => {
        console.error("Error finding user:", err);
        res.status(500).json(err);
      });
  },
  getPreviewIds(req, res) {
    User.findById(req.params.userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        res.json(user.bg_collection);
      })
      .catch((err) => {
        console.error("Error finding user:", err);
        res.status(500).json(err);
      });
  },
  // add board game to user's collection
  // addBoardGame(req, res) {
  //   const { bg_collection } = req.body;
  //   // Assuming the request body contains only "bg_collection" as a string
  //   User.findOneAndUpdate(
  //     { username: req.params.username },
  //     { $push: { bg_collection: bg_collection } }, // Use $push to add the string to the array
  //     { new: true }
  //   )
  //     .then((user) => res.json(user))
  //     .catch((error) => {
  //       console.error(error);
  //       res.status(500).json({ error: 'An error occurred while adding the board game to the collection.' });
  //     });
  // },

  // deleteBoardGame(req, res) {
  //   const { username } = req.params; // Get the username from the URL parameters
  //   const { bg_collection } = req.body; // Assuming you provide the board game ID in the request body

  //   User.findOneAndUpdate(
  //     { username: username },
  //     { $pull: { bg_collection: bg_collection } }, // Use $pull to remove the specified board game ID from the array
  //     { new: true }
  //   )
  //     .then((user) => {
  //       if (!user) {
  //         // Handle the case where the user with the provided username is not found
  //         return res.status(404).json({ error: 'User not found.' });
  //       }
  //       res.json(user);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       res.status(500).json({ error: 'An error occurred while deleting the board game from the collection.' });
  //     });
  // }
};
