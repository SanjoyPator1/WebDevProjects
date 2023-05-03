// import Sidebar from "@/components/Sidebar";
import GlassPane from "@/components/GlassPane";
import "@/styles/global.css"
import Sidebar from "@/components/Sidebar/Sidebar";
import { PRIMARY_DISTANCE } from "@/lib/constants";
import { bodyFont } from "@/lib/fonts";
import Router from "next/router"
import ShopSidebar from "@/components/Sidebar/SidebarCustom";

const glassStyle: React.CSSProperties = {
  height:"100%",
  borderRadius:0,
  overflow:"auto"
};

export default function DashboardRootLayout({ children }: {
    children: React.ReactNode,
  }) {

    
  return (
    <html lang="en"  className="candy-mesh">
      <head />
      <body>
      <div className="row-flex-container" style={{height:"100%"}}>
            <div className="sidebar-layout-container">
              <Sidebar />
              {/* <ShopSidebar/> */}
            </div>
            <div className="main-page-container" style={{flex:1, height:"100%", overflow:"auto"}}>
              <main className={bodyFont.className} style={{height:"100%"}}>{children}</main>
            </div>
        </div>
        <div id="modal"></div>

      </body>
    </html>
  );
}
