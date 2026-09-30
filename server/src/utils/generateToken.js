import jwt from "jsonwebtoken";

export function generateToken(user) {
  return jwt.sign(
    {
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      subject: user.id,
      expiresIn: process.env.JWT_EXPIRES_IN || "2h",
      issuer: "privilege-clothing-api",
      audience: "privilege-clothing-web",
      algorithm: "HS256"
    }
  );
}