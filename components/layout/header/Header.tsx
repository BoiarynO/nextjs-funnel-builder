"use client";

import Heading from "@/components/ui/heading/Heading";
import LinkButton from "@/components/ui/linkButton/LinkButton";

import packageJson from "../../../package.json";

import styles from "./Header.module.css";
import NavBar from "./navBar/NavBar";

export default function Header() {
  return (
    <header className={styles.root}>
      <LinkButton href="/">
        <Heading as="h1" colored className={styles.brand}>
          Funnels Builder v{packageJson.version}
        </Heading>
      </LinkButton>

      <NavBar />
    </header>
  );
}
