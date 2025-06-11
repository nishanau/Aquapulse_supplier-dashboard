import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Home Page</h1>
      <div>
        <h1 className={styles.title}>Hi there</h1>
      </div>
    </div>
  );
}
