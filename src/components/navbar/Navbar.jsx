"use client";
import styles from "./navbar.module.css";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  useAuth();

  const links = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Login",
      href: "/login",
    },
    {
      label: "Register",
      href: "/register",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.logo}>Logo</div>
      <div className={styles.links}>
        {links.map((link) => (
          <Link href={link.href} key={link.label}>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
