import bcrypt from "bcrypt";
import { SignJWT, jwtVerify } from "jose";
import db from "./db"
import { UserModel } from "@/model/databaseType";

export const hashPassword = (password  : string) => bcrypt.hash(password, 10);

export const comparePasswords = (plainTextPassword : string, hashedPassword: string) =>
    bcrypt.compare(plainTextPassword, hashedPassword);


//create a JWT
export const createJWT = (user) => {
    // return jwt.sign({ id: user.id }, 'cookies')
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + 60 * 60 * 24 * 7;

    return new SignJWT({ payload: { id: user.id, email: user.email } })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setExpirationTime(exp)
        .setIssuedAt(iat)
        .setNotBefore(iat)
        .sign(new TextEncoder().encode(process.env.JWT_SECRET));
};

//validate JWT signature
export const validateJWT = async (jwt) => {
    const { payload } = await jwtVerify(
        jwt,
        new TextEncoder().encode(process.env.JWT_SECRET)
    );

    return payload.payload as any;
};

//Getting the JWT from cookies:
export const getUserFromCookie = async (cookies) => {
    const cookieName  =  process.env.COOKIE_NAME;
    const jwt = cookies.get(cookieName);

    const { id } = await validateJWT(jwt.value);

    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [id];
    let user : UserModel;
    try {
      const result = await db({ text: query, params: values });
      user =  result.rows[0];
    } catch (error) {
      throw error;
    }

    return user;
};

