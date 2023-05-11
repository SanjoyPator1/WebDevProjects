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
      <body className={bodyFont.className}>
      <div id="modal" className="row-flex-container" style={{ width:"100vw"}}>
            <div className="sidebar-layout-container">
              <Sidebar />
            </div>
            <div className="" style={{width:"100%"}}>
              <main className={clsx(bodyFont.className,"main-page-container")} style={{height:"100%"}}>{children}</main>
            </div>
        </div>
        <div ></div>
      </body>
    </html>
  );
}
