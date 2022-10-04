const express = require("express");
const multer = require("multer");

const ViewerController = require("../controllers/ViewerController");
const auth = require("../middleware/Auth");
const encrypt = require("../middleware/Encrypt");
const { memoryStorage } = require("multer");
const pool = require("../Connection");

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

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const viewers = await pool.query(
      `select * from "Account" where username= $1 and password= $2 and role_id= 2`,
      [username]
    );
    if(viewers.rows.length===0)
  } catch (error) {}
});

module.exports = router;
