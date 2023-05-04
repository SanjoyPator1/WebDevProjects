// import Sidebar from "@/components/Sidebar";
import GlassPane from "@/components/GlassPane";
import "@/styles/global.css"
import Sidebar from "@/components/Sidebar/Sidebar";
import { PRIMARY_DISTANCE } from "@/lib/constants";
import { bodyFont } from "@/lib/fonts";
import clsx from "clsx";

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
      <div className="row-flex-container " style={{height:"100%", width:"100vw", overflow:"hidden"}}>
            <div className="sidebar-layout-container">
              <Sidebar />
              {/* <ShopSidebar/> */}
            </div>
            <div className="" style={{height:"100%",width:"100%", overflow:"hidden"}}>
              <main className={clsx(bodyFont.className,"main-page-container")} style={{height:"100%"}}>{children}</main>
            </div>
        </div>
        <div id="modal"></div>

      </body>
    </html>
  );
}
