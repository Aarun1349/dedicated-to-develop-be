"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = require("express");
var _authMiddleware = require("../middleware/auth.middleware.js");
var _bulletsController = require("../controllers/bullets.controller.js");
const bulletRouter = (0, _express.Router)();
bulletRouter.use(_authMiddleware.verifyJWT);
bulletRouter.route("/newBullet").post(_bulletsController.addNewBullet);
bulletRouter.route("/today").get(_bulletsController.getTodaysBulletOfUser);
bulletRouter.route("/change-state/:bulletId").put(_bulletsController.changeState);
bulletRouter.route("/change-date/:bulletId").put(_bulletsController.changeDate);
bulletRouter.route("/:bulletId").delete(_bulletsController.deleteBullet).get(_bulletsController.getBullet).put(_bulletsController.updateBullet).patch(_bulletsController.markDone);
var _default = exports.default = bulletRouter;