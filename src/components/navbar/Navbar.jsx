"use client";
import styles from "./navbar.module.css";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/provider/ToastProvider";
import { useRouter } from "next/navigation";
const Navbar = () => {
  useAuth();
  const { isAuthenticated, user, logout, isLoading } = useAuthStore();
  const { showToast } = useToast();
  const router = useRouter();
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      isProtected: true,
    },
    {
      label: "Profile",
      href: "/profile",
      isProtected: true,
    },
    {
      label: "Login",
      href: "/login",
      isProtected: false,
    },
    {
      label: "Register",
      href: "/register",
      isProtected: false,
    },
    {
      label: "Logout",
      href: "/logout",
      isProtected: true,
    },
  ];
  const handleLogout = async () => {
    const loggedOut = await logout();
    if (loggedOut) {
      showToast("Logged Out successfully", "success");
      router.push("/login");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}>{user ? user.company : "Logo"}</div>

      <div className={styles.links}>
        {isAuthenticated && !isLoading
          ? links
              .filter((link) => link.isProtected)
              .map((link) =>
                link.label === "Logout" ? (
                  <Link
                    key={link.href}
                    href=""
                    className={styles.link}
                    onClick={handleLogout}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={styles.link}
                  >
                    {link.label}
                  </Link>
                )
              )
          : links
              .filter((link) => !link.isProtected)
              .map((link) => (
                <Link key={link.href} href={link.href} className={styles.link}>
                  {link.label}
                </Link>
              ))}
      </div>
    </div>
  );
};

export default Navbar;
