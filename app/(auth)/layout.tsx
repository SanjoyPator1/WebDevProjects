import GlassPane from "@/components/GlassPane";
import "@/styles/global.css"

const glassStyle: React.CSSProperties = {
  height:"100%",
  paddingInline:"0.5rem"
};

export default function AuthRootLayout({ children }: {
    children: React.ReactNode,
  }) {
    return (
      <html lang="en" className="rainbow-mesh">
        <head />
        <body className="pure-center" style={{padding:"1.5rem"}}>
          <GlassPane className="medium-container" styles={glassStyle} >
            {children}
          </GlassPane>
        </body>
      </html>
    );
  }