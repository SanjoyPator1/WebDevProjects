
import UserModel from "../db/user.model"
import User  from "../db/user.model"
import jwt from 'jsonwebtoken'


export const generateToken = (userId) => {
    const payload = {
      userId,
    };

    // Generate the JWT token with the payload and the secret key
    const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
      expiresIn:process.env.TOKEN_EXPIRY_TIME,
    });
  
    return token;
};

export const isEmailAlreadyExist= async (email) => {
    const user = await UserModel.findOne({ email: email });
    return user ? true : false;
}

export const verifyToken = (token) => {
    try {
      // Verify the token and get the decoded payload
      const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
  
      // Return the decoded payload
      return decoded;
    } catch (error) {
      // If the token is invalid or has expired, throw an error
      throw new Error('Invalid token');
    }
  };

