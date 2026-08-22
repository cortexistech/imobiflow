import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

const PUBLIC_FILE = /\.[^/]+$/;
const AUTH_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

function isRootHost(host: string) {
  const hostname = host.split(":")[0];
  const rootHost = ROOT_DOMAIN.split(":")[0];
  return (
    hostname === rootHost ||
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "www.imobiflow.app" ||
    hostname === "imobiflow.app"
  );
}

function tenantKeyFromHost(host: string) {
  const [hostname] = host.split(":");
  const rootHost = ROOT_DOMAIN.split(":")[0];

  if (hostname.endsWith(`.${rootHost}`)) {
    return hostname.slice(0, -(rootHost.length + 1));
  }
  if (hostname.endsWith(".localhost")) {
    return hostname.replace(/\.localhost$/, "");
  }
  if (hostname.endsWith(".imobiflow.app")) {
    return hostname.replace(/\.imobiflow.app$/, "");
  }
  return hostname;
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get("host") || "";
  const { pathname } = url;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const hasSession = AUTH_COOKIE_NAMES.some((name) => req.cookies.has(name));

  if (pathname.startsWith("/dashboard") && !hasSession) {
    const login = new URL("/login", req.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  if (
    pathname.startsWith("/t/") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/pricing")
  ) {
    return NextResponse.next();
  }

  if (isRootHost(hostname)) {
    return NextResponse.next();
  }

  const tenantKey = tenantKeyFromHost(hostname);
  if (!tenantKey) return NextResponse.next();

  url.pathname = `/t/${tenantKey}${pathname}`;
  const response = NextResponse.rewrite(url);
  response.headers.set("x-tenant-key", tenantKey);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
