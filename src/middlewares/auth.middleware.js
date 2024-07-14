import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    // get token from cookies or header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "") 

    // if token is not present in cookies or header then throw error 
    if (!token) { 
      throw new ApiError(401, "Unauthorized Request");
    }

    // verify the token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); 

    
    // find user by id and select only required fields
    const user = await User.findById(decodedToken?._id).select( 
      "-password -refreshToken"
    );

    // if user not found then throw error
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // if user found then set it to request object and move to next middleware
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});