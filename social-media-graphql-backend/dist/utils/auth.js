import UserModel from "../db/user.model";
import jwt from 'jsonwebtoken';
export const generateToken = (userId) => {
    const payload = {
        userId,
    };
    // Generate the JWT token with the payload and the secret key
    const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
        expiresIn: process.env.TOKEN_EXPIRY_TIME,
    });
    return token;
};
export const isEmailAlreadyExist = async (email) => {
    const user = await UserModel.findOne({ email: email });
    return user ? true : false;
};
export const verifyToken = (token) => {
    try {
        // Verify the token and get the decoded payload
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        // Return the decoded payload
        return decoded;
    }
    catch (error) {
        // If the token is invalid or has expired, throw an error
        return null;
    }
};
// const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v1/userinfo";
// export const verifyGoogleToken = (accessToken: string): Promise<{ name: string; email: string; picture: string }> => {
//   console.log("accessToken: ", accessToken);
//   return new Promise((resolve, reject) => {
//     const options = {
//       hostname: "www.googleapis.com",
//       path: `/oauth2/v1/userinfo?access_token=${accessToken}`,
//       method: "GET",
//     };
//     console.log(options);
//     const req = http.request(options, (res) => {
//       let data = "";
//       res.on("data", (chunk) => {
//         data += chunk;
//       });
//       res.on("end", () => {
//         try {
//           const userInfo: { name: string; email: string; picture: string } = JSON.parse(data);
//           console.log("userInfo ")
//           console.log(userInfo)
//           // Check if the response contains the required fields (name, email, picture)
//           if (!userInfo.name || !userInfo.email || !userInfo.picture) {
//             console.log("userInfo error ")
//             reject(new Error("Invalid Google token response"));
//           } else {
//             resolve(userInfo);
//           }
//         } catch (error) {
//           console.log("error inside Google token ",error)
//           reject(new Error("Failed to parse Google token response"));
//         }
//       });
//     });
//     req.on("error", (error) => {
//       console.log("error in Google token request ",error)
//       reject(new Error("Failed to fetch Google user info"));
//     });
//     req.end();
//   });
// };
