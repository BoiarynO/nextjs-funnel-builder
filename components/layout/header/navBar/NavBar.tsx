"use client";

import { usePathname } from "next/navigation";

import Dropdown from "@/components/ui/dropdown/Dropdown";
import LinkButton from "@/components/ui/linkButton/LinkButton";

import styles from "./NavBar.module.css";

const PAGES = [
  { href: "/", label: "Home" },
  { href: "/uitest", label: "UI Test" },
  { href: "/funnels", label: "Funnels" },
] as const;

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <Dropdown key={pathname} label="Pages" outlined position="bottom-right">
        <div className={styles.pagesDropdown}>
          {PAGES.map((page) => (
            <LinkButton
              key={page.href}
              href={page.href}
              active={pathname === page.href}
            >
              {page.label}
            </LinkButton>
          ))}
        </div>
      </Dropdown>
    </nav>
  );
}
