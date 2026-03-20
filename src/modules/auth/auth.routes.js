const express = require("express");
const authController = require("./auth.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

const router = express.Router();

router.post("/google", authController.googleLogin);
router.get("/me", authMiddleware, authController.me);
router.post("/logout", authController.logout);

module.exports = router;
