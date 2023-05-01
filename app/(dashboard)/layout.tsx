// import Sidebar from "@/components/Sidebar";
import GlassPane from "@/components/GlassPane";
import clsx from "clsx";
import "@/styles/global.css"
import Sidebar from "@/components/Sidebar/Sidebar";
import { PRIMARY_DISTANCE } from "@/lib/constants";
import { bodyFont } from "@/lib/fonts";


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
      <GlassPane className="" styles={glassStyle} >
      <div className="row-flex-container" style={{height:"100%"}}>
            <div className="">
              <Sidebar />
            </div>
            <div className="" style={{flex:1,padding:PRIMARY_DISTANCE, height:"100%", overflow:"auto"}}>
              <main className={bodyFont.className}>{children}</main>
            </div>
        </div>
        <div id="modal"></div>
        </GlassPane>
      </body>
    </html>
  );
}
