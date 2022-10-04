const express = require("express");
const multer = require("multer");

const ViewerController = require("../controllers/ViewerController");
const auth = require("../middleware/Auth");
const encrypt = require("../middleware/Encrypt");
const { memoryStorage } = require("multer");

const router = express.Router();
const upload = multer({ storage: memoryStorage() });

router.get(
  '/info/":viewer_id',
  ViewerController.get,
  ViewerController.onGetResult
);

router.get(
  "/movie-following",
  auth.verifyUser,
  ViewerController.getMovieFollowing,
  ViewerController.onGetResult
);

router.get(
  "/comment-history/:viewer_id",
  auth.verifyAdmin,
  ViewerController.getCommentHistory,
  ViewerController.onGetResult
);

router.post(
  "/follow-movie/movie_id",
  auth.verifyUser,
  ViewerController.followMovie,
  ViewerController.onGetResult
);

router.post(
  "/unfollow-movie/:movie_id",
  auth.verifyUser,
  ViewerController.unfollowMovie,
  ViewerController.onGetResult
);

// router.post("/login", ViewerController.login);

router.post("/users", async (req, res) => {
  // Create a new user
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/login", async (req, res) => {
  //Login a registered user
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/users/me/logout", auth, async (req, res) => {
  // Log user out of the application
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
