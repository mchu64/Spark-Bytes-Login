import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";

// these are the protected routes that you need token verification
// add routes that you want to have it protected
// also only these routes can get the decoded jwt token data
// Many of these routes do not exits yet. That's okay (:
const protectedRoutes = [
  "/main",
  "/profile/[id]",
  "/events/create",
  "/events/edit/[event_id]",
  "/events",
  "/events/[event_id]",
  "/protected",
];

const RedirectBasedOnAuth = ({ children }: { children: React.ReactNode }) => {
  /**
   * This is a higher level component who's job it is to redirect the user to the home page if they are not authenticated but attempt to navigate to a protected route.
   */
  const [calledPush, setCalledPush] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const currentRoute = router.asPath; // this shows the route you are currently in

  useEffect(() => {
    if (protectedRoutes.includes(currentRoute)) {
      // Check if token is valid and if not navigate home
      if (!isAuthenticated() && !calledPush) {
        setCalledPush(true);
        router.push("/");
        return;
      }
    }
  }, [calledPush, currentRoute, isAuthenticated, router]);

  return children;
};

export default RedirectBasedOnAuth;
