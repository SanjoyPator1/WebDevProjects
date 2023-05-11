import GlassPane from "@/components/GlassPane";
import { DISTANCE_CONSTANT, PRIMARY_DISTANCE, SECONDARY_DISTANCE } from "@/lib/constants";
import { pageTitleFont } from "@/lib/fonts";
import clsx from "clsx";
import CalendarTask from "@/components/CalendarTask/CalendarTask";

const CalendarPage = () => {
  return (
    <div
      className={clsx("column-flex-container")}
      style={{ gap: DISTANCE_CONSTANT }}
    >
      {/* Title JSX */}
      <div className="top-content-container">
        <p className={clsx(pageTitleFont.className, "title-font")}>CALENDAR</p>
      </div>
        <CalendarTask/>
    </div>
  );
};

export default CalendarPage;
