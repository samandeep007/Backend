import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const generateRefreshAndAccessTokens = async (id) => {
    try {
        const user = await User.findById(id);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
    
        user.refreshToken = refreshToken;
        
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");

    }
}

const registerUser = asyncHandler(async (req, res) => {

    const { username, email, fullName, password } = req.body;

    if (
        [username, email, fullName, password].filter(field => field?.trim() === "").length > 0
    ) {
        throw new ApiError(404, "All fields are required");
    }

  
    const isExistingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (isExistingUser) {
        throw new ApiError(409, "User with these credentials already exists");
    }


    let avatarLocalPath = req.file?.path;

    const avatar = avatarLocalPath ? await uploadOnCloudinary(avatarLocalPath) : {};

    const user = await User.create({
        username,
        email,
        fullName,
        avatar: avatar?.url || `https://ui-avatars.com/api/?name=${fullName.split(" ").join("+")}` || '',
        password
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, createdUser, "User registered successfully"));
});



const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    if (!email && !username) {
        throw new ApiError(400, "Username or email required");
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "password incorrect | Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateRefreshAndAccessTokens(user._id);

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

    const options = {
        httpOnly: true,
        secure: true
    };

 
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
})


const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user?._id, {
        $unset: {
            refreshToken: 1
        }
    }, { new: true });

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully"
            )
        );

})


const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        throw new ApiError(400, "Fields not provided")
    }

    try {
        const user = await User.findById(req?.user.id);

        const isValidPassword = await user.isPasswordCorrect(currentPassword);

        if (!isValidPassword) {
            throw new ApiError(401, "Authentication failed | Wrong password!")
        }

        user.password(newPassword);
        await user.save({ validateBeforeSave: false });

        return res
            .status(200)
            .json(new ApiResponse(
                200, {}, "Password changed successfully"
            ));
    } catch (error) {
        throw new ApiError(
            500,
            error?.message || "Something went wrong while changing the password"
        );
    }
})


const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req?.user.id).select("-password -refreshToken");
    return res
        .status(200)
        .json(new ApiResponse(200, user, "User fetched successfully"));
})

const updateUserDetails = asyncHandler(async (req, res) => {
    const { fullName, username } = req.body;
    const avatarLocalPath = req.file?.path;
    const userDetails = {
        fullName: fullName,
        username: username,
        avatar: avatarLocalPath
    }
    const newUserDetails = Object.entries(userDetails).filter(field => field[1]?.trim() !== "");
   try {
     const user = await User.findById(req.user.id);
     for (const [key, value] of newUserDetails) {
        if (key === "avatar" && avatarLocalPath) {
            const avatar = await uploadOnCloudinary(value);
            user.avatar = avatar.url;
        } else {
            user[key] = value;
        }
    }
     await user.save({ validateBeforeSave: false });
     return res
     .status(200)
     .json(new ApiResponse(
         200,
         {},
         "User details update successfully"
     ));
   } catch (error) {
      throw new ApiError(400, "Something went wrong while updating the user details");
   }
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
  
    if (!incomingRefreshToken) {
      throw new ApiError(402, "unauthorized request");
    }
  
    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
  
      const user = await User.findById(decodedToken?._id);
  
      if (!user) {
        throw new ApiError(401, "Invalid refresh token");
      }
  
      if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or used");
      }
  
      const options = {
        httpOnly: true,
        secure: true,
      };
  
      const { accessToken, newRefreshToken } =
        await generateAccessAndRefreshTokens(user._id);
  
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
          new ApiResponse(
            200,
            { accessToken, newRefreshToken },
            "Access token refreshed"
          )
        );
    } catch (error) {
      throw new ApiError(
        401,
        error?.message || "Something went wrong while refreshing token!"
      );
    }
  });


export {registerUser, loginUser, logoutUser, refreshAccessToken, updateUserDetails, getCurrentUser, changePassword}