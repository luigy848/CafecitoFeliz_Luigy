import { useLocation } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import "./Layout.css";

export default function Layout({ children }) {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <div className="layout">
      {!isLogin && <Header />}
      <main className="layout-content">{children}</main>
      {!isLogin && <Footer />}
    </div>
  );
}
