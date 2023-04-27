import { Inter } from "@next/font/google";
// import Sidebar from "@/components/Sidebar";
import clsx from "clsx";
// import GlassPane from "@/components/GlassPane";
// import "@/styles/global.css";

export default function DashboardRootLayout({ children }: {
    children: React.ReactNode,
  }) {
  return (
    <html lang="en" className="">
      <head />
      <body>
        <div className="main-root-container">
            <div className="sidebar-container">
              {/* <Sidebar /> */}
              sidebar
            </div>
            <div className="main-content-container">
              <main>{children}</main>
            </div>
        </div>
        <div id="modal"></div>
      </body>
    </html>
  );
}
