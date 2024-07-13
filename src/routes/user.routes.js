import { Router } from 'express';
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    updateUserDetails, 
    refreshAccessToken,
    changePassword,
    getCurrentUser
} from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middleware.js'
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route("/signup").post(upload.single([{
    name: "avatar"
  }]), registerUser);

  
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateUserDetails);

export default router;