import express from "express";

const router = express.Router();

router.get("/", (req, res, next) => {
  try {
    res.send("HELLO WORLD");
  } catch (err) {
    next(err);
  }
});

export default router;
