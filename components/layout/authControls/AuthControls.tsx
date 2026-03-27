"use client";

import { signIn, signOut, useSession } from "next-auth/react";

import Button from "@/components/ui/button/Button";

import styles from "./AuthControls.module.css";

export default function AuthControls() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";
  const isLoggedIn = Boolean(session?.user);
  const userDisplayName = session?.user?.name || session?.user?.email || "User";

  if (isLoggedIn) {
    return (
      <div className={styles.authGroup}>
        <span className={styles.userLabel} title={userDisplayName}>
          {userDisplayName}
        </span>
        <Button outlined onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <Button outlined onClick={() => signIn("google")} disabled={isLoading}>
      Sign in with Google
    </Button>
  );
}
