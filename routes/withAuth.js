// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { React } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import {
  isAuthenticatedSelector,
  isAuthenticatingSelector,
} from "../store/slices/userSlice";

const withAuth = (WrappedComponent) => (props) => {
  // this hoc only supports client side rendering.

  const isClient = () => typeof window !== "undefined";

  if (isClient()) {
    const router = useRouter();
    const { route } = router;
    const isAuthenticated = useSelector(isAuthenticatedSelector);
    const isAuthenticating = useSelector(isAuthenticatingSelector);
    // is fetching session (eg. show spinner)
    if (isAuthenticating) {
      return null;

    }

    // If user is not logged in, return login component
    if (route !== "/auth/login") {
      if (!isAuthenticated) {
        router.push(`/auth/login`);
        return null;
      } 
      else if (route == "/") {
        router.push(`/dashboard`); // default page after login when call root path
        return null;
      }
    } else {
      if (isAuthenticated) {
        router.push(`/dashboard`); // default page after login
        return null;
      }
    }
    // If user is logged in, return original component
    return <WrappedComponent {...props} />;
  }
  return null;
};
export default withAuth;
