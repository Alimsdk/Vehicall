export const runtime = "nodejs";

export default function handler(req: any, res: any) {
  const secret = process.env.JWTSECRET ?? null;

  // Optional: list all env vars containing "JWT" for sanity
  const jwtKeys = Object.keys(process.env).filter(k => k.includes("JWT"));

  res.status(200).json({
    JWTSECRET: secret,
    jwtKeys,
  });
}
