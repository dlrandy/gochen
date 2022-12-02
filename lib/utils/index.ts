import { jwtVerify } from "jose";

export async function verifyToken(token:string|null) {
  try {
    if (token) {
 
      const verified = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      return verified.payload && verified.payload?.issuer as string;
    }
    return null;
  } catch (err) {
    console.error({ err });
    return null;
  }
}
