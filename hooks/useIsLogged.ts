import { useSession } from "next-auth/react";

export default function useIsLogged() {
  const { data: session } = useSession();
  const isLogged = Boolean(session?.user);

  return isLogged;
}
