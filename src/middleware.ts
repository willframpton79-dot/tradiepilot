export { default } from "next-auth/middleware";
export const config = {
  matcher: [
    "/((?!auth/signin|auth/signup|auth/error|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
