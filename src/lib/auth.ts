import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const cookieName = "gariton_admin";

function secret() {
  return process.env.AUTH_SECRET || "dev-secret";
}

function credentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "change-this-password"
  };
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function verifyCredentials(username: string, password: string) {
  const configured = credentials();
  return username === configured.username && password === configured.password;
}

export function createSessionValue() {
  const payload = JSON.stringify({ sub: credentials().username, iat: Date.now() });
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function isValidSession(value?: string) {
  if (!value) return false;
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return false;
  const expected = sign(encoded);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function isAdmin() {
  const cookieStore = await cookies();
  return isValidSession(cookieStore.get(cookieName)?.value);
}

export function requireAdmin(request: NextRequest) {
  return isValidSession(request.cookies.get(cookieName)?.value);
}

export function setSessionCookie(response: NextResponse, value: string) {
  response.cookies.set(cookieName, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.AUTH_COOKIE_SECURE === "true",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(cookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.AUTH_COOKIE_SECURE === "true",
    path: "/",
    maxAge: 0
  });
}
