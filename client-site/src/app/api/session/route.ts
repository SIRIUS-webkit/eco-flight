import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken"; // For encoding user data securely

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key"; // Use environment variables for security

// Define the type of data stored in the JWT
interface TokenPayload {
  loggedIn: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { loggedIn }: { loggedIn: boolean } = await request.json();

    if (loggedIn) {
      const token = jwt.sign({ loggedIn: true }, SECRET_KEY, {
        expiresIn: "1h",
      });

      return NextResponse.json(
        { message: "Login state stored" },
        {
          headers: {
            "Set-Cookie": `auth_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`,
          },
        }
      );
    } else {
      return NextResponse.json({ message: "User not logged in" });
    }
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get("auth_token")?.value;

    if (!cookie) {
      return NextResponse.json({ loggedIn: false });
    }

    const data = jwt.verify(cookie, SECRET_KEY) as TokenPayload;

    return NextResponse.json({ loggedIn: data.loggedIn });
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ loggedIn: false });
  }
}
