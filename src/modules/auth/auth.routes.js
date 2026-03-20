const express = require("express");
const authController = require("./auth.controller");

const router = express.Router();

router.post("/google", authController.googleLogin);
router.get("/me", authController.me);
router.post("/logout", authController.logout);

module.exports = router;
