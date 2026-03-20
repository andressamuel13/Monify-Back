const authService = require("./auth.service");

async function googleLogin(req, res, next) {
  try {
    const data = await authService.googleLogin(req.body);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

async function me(_req, res, next) {
  try {
    const data = await authService.me();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

async function logout(_req, res, next) {
  try {
    const data = await authService.logout();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  googleLogin,
  me,
  logout,
};
