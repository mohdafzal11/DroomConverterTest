import type { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/session`, {
      headers: {
        cookie: req.headers.cookie || ""
      }
    });

    const session = await response.json();

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(session));
  } catch (error) {
    console.error("Session API error:", error);
    res.status(500).json({ error: "Failed to get session" });
  }
} 