import { useEffect } from "react";
import "../styles.css";

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    fetch("/api/socket"); // инициализация сервера
  }, []);
  return <Component {...pageProps} />;
}
