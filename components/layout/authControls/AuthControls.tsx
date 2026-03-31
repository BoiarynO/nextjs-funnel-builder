"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

import { useAppLoadingStore } from "@/stores/appLoadingStore";
import Button from "@/components/ui/button/Button";
import LoadingOverlay from "@/components/ui/loadingOverlay/LoadingOverlay";

import styles from "./AuthControls.module.css";

export default function AuthControls() {
  const { data: session } = useSession();
  const isAuthLoading = useAppLoadingStore((s) => s.isAuthLoading);
  const [isSignInPending, setSignInPending] = useState(false);
  const [isSignOutPending, setSignOutPending] = useState(false);

  const isLoggedIn = Boolean(session?.user);
  const userDisplayName = session?.user?.name || session?.user?.email || "User";

  const handleSignIn = () => {
    if (isAuthLoading || isSignInPending) return;
    setSignInPending(true);
    void signIn("google").catch(() => setSignInPending(false));
  };

  const handleSignOut = () => {
    if (isSignOutPending) return;
    setSignOutPending(true);
    void signOut().catch(() => setSignOutPending(false));
  };

  if (isLoggedIn) {
    return (
      <div className={styles.authGroup}>
        <span className={styles.userLabel} title={userDisplayName}>
          {userDisplayName}
        </span>
        <LoadingOverlay loading={isSignOutPending}>
          <Button
            outlined
            onClick={handleSignOut}
            disabled={isSignOutPending}
          >
            Sign out
          </Button>
        </LoadingOverlay>
      </div>
    );
  }

  return (
    <LoadingOverlay loading={isSignInPending}>
      <Button
        outlined
        onClick={handleSignIn}
        disabled={isAuthLoading || isSignInPending}
      >
        Sign in with Google
      </Button>
    </LoadingOverlay>
  );
}
