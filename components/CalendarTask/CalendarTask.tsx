"use client";
import React, { useEffect, useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import CustomCalendar from "../customCalendar/CustomCalendar";
import { format, isSameDay, parseISO, startOfToday } from "date-fns";
import { formatDate } from "@/lib/functions";
import { TaskModel } from "@/model/databaseType";
import { getTask } from "@/lib/api";
import ColorCard from "../ColorCard/ColorCard";
import clsx from "clsx";
import { subheaderFont } from "@/lib/fonts";
import { DARK_COLOR } from "@/lib/constants";
import SmallTaskCard from "../SmallTaskCard/SmallTaskCard";
import NewProject from "../NewProject/NewProject";

const CalendarTask = () => {
  const FILTER_BY = {
    wholeMonth: "wholeMonth",
    selectedDate: "selectedDate",
  };

  let today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [days, setDays] = useState<Date[]>([]);
  const [taskList, setTaskList] = useState<TaskModel[]>([]);
  const [filterBy, setFilterBy] = useState(FILTER_BY.wholeMonth);

  // GETTING TASK DATA
  const getTaskList = async () => {
    const startDate = days[0];
    const endDate = days[days.length - 1];

    try {
      const taskRes = await getTask(startDate, endDate);
      const tasksListResRows = await taskRes.rows;
      setTaskList(tasksListResRows);
    } catch (e) {
      console.log("error while getting task data in calendar");
    }
  };

  useEffect(() => {
    days.length > 0 && getTaskList();
  }, [days]);

  // HANDLE CLICK ON DATE
  const onDateClick = (date: Date) => {
    setSelectedDay(date);
    setFilterBy(FILTER_BY.selectedDate);
  };

  // HANDLE ON CLICK GET FULL MONTH TASK
  const handleGetFullMonthTask = () => {
    setFilterBy(FILTER_BY.wholeMonth);
  };

  return (
    <Grid className="calendar-glass-container" container spacing={2} sx={{ position: "relative" }}>
      <div style={{ display: "none" }}>
            <NewProject/>
          </div>
      <Grid container item lg={12} spacing={3}>
        <Grid item xs={12} md={5} lg={4} className="calendar-sticky">
          <CustomCalendar
            setDaysProp={setDays}
            onDateClick={onDateClick}
            eventDataProps={taskList}
            eventKeyName="due"
          />
        </Grid>
        <Grid
          container
          item
          xs={12}
          md={7}
          lg={8}
          sx={{ alignContent: "flex-start" }}
          spacing={1}
        >
          <Grid
            container
            item
            xs={12}
            className={clsx("new-project-container", "sticky-header")}
          >
            <Grid item xs={12}>
              <Typography variant="h4">Task list</Typography>
              filter by {filterBy}
            </Grid>
            <Grid item xs={12} md={8} lg={7}>
              {days.length > 0 && filterBy === FILTER_BY.wholeMonth ? (
                <>
                  <Typography
                    className={clsx(subheaderFont.className, "sub-header-font")}
                    sx={{ display: "inline" }}
                  >
                    {format(days[0], "dd-MMM-yyyy")}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ display: "inline", marginInline: "1rem" }}
                  >
                    to
                  </Typography>

                  <Typography
                    className={clsx(subheaderFont.className, "sub-header-font")}
                    sx={{ display: "inline" }}
                  >
                    {format(days[days.length - 1], "dd-MMM-yyyy")}
                  </Typography>
                </>
              ) : (
                <Typography
                  className={clsx(subheaderFont.className, "sub-header-font")}
                  sx={{ display: "inline" }}
                >
                  {format(selectedDay, "dd-MMM-yyyy")}
                </Typography>
              )}
            </Grid>
            <Grid
              container
              item
              xs={12}
              md={4}
              lg={5}
              justifyContent="flex-end"
            >
              <Button
                variant={
                  filterBy === FILTER_BY.wholeMonth ? "contained" : "outlined"
                }
                sx={{backgroundColor: filterBy === FILTER_BY.wholeMonth ? DARK_COLOR : "white", color: filterBy === FILTER_BY.wholeMonth ?"white": DARK_COLOR, border: `1px solid ${DARK_COLOR}` }}
                onClick={() => handleGetFullMonthTask()}
              >
                Full Month
              </Button>
            </Grid>
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid container item xs={12} spacing={2}>
              {taskList && taskList.length > 0 ? (
                taskList.map((task: TaskModel, index) => {
                  return filterBy === FILTER_BY.wholeMonth ? (
                    <Grid
                      className="card-container"
                      key={index}
                      item
                      xs={12}
                      md={4}
                      lg={3}
                    >
                      <div className="big-screen-view">
                        <ColorCard task={task} />
                      </div>
                      <div className="small-screen-view">
                        <SmallTaskCard task={task} />
                      </div>
                    </Grid>
                  ) : isSameDay(selectedDay, parseISO(task.due)) ? (
                    <Grid
                      className="card-container"
                      key={index}
                      item
                      xs={12}
                      md={4}
                      lg={3}
                    >
                      <div className="big-screen-view">
                        <ColorCard task={task} />
                      </div>
                      <div className="small-screen-view">
                        <SmallTaskCard task={task} />
                      </div>
                    </Grid>
                  ) : (
                    <React.Fragment key={index}></React.Fragment>
                  );
                })
              ) : (
                <Grid item xs={12}>
                  NO TASK
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* <div id="modal"></div> */}
    </Grid>
  );
};

export default CalendarTask;
