"use client";

import LinkButton from "@/components/ui/linkButton/LinkButton";

import styles from "./Header.module.css";
import NavBar from "./navBar/NavBar";

export default function Header() {
  return (
    <header className={styles.root}>
      <LinkButton href="/">
        <p className={styles.brand}>Funnels Builder</p>
      </LinkButton>

      <NavBar />
    </header>
  );
}
