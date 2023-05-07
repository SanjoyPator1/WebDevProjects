"use client";
import React, { useEffect, useState } from "react";
import { Button, Grid, Typography } from "@mui/material";
import CustomCalendar from "../customCalendar/CustomCalendar";
import { format, parseISO, startOfToday } from "date-fns";
import { formatDate } from "@/lib/functions";
import { TaskModel } from "@/model/databaseType";
import { getTask } from "@/lib/api";
import ColorCard from "../ColorCard/ColorCard";
import clsx from "clsx";
import { subheaderFont } from "@/lib/fonts";
import { DARK_COLOR } from "@/lib/constants";

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
  const [hasEvents, setHasEvents] = useState("no events")


  // GETTING TASK DATA
  const getTaskList = async () => {
    const startDate = filterBy === FILTER_BY.wholeMonth ? days[0] : selectedDay;
    const endDate =
      filterBy === FILTER_BY.wholeMonth ? days[days.length - 1] : selectedDay;

    try {
      const taskRes = await getTask(startDate, endDate);
      const tasksListResRows = await taskRes.rows;
      console.log("new task list fetched",tasksListResRows.length)
      if(tasksListResRows.length > 0) {
        console.log("setting has event")
      }
      setTaskList(tasksListResRows);
    } catch (e) {
      console.log("error while getting task data in calendar");
    }
  };

  useEffect(() => {
    console.log("getting tasks data")
    days.length > 0 && getTaskList();
  }, [days,selectedDay, filterBy]);

  // HANDLE CLICK ON DATE
  const onDateClick = (date: Date) => {
    setSelectedDay(date);
    setFilterBy(FILTER_BY.selectedDate);
  };

  return (
    <Grid container spacing={2} sx={{ position: "relative" }}>
      <Grid container item lg={12} spacing={3}>
        <Grid item xs={12} md={5} lg={4}>
          <CustomCalendar
            setDaysProp={setDays}
            onDateClick={onDateClick}
            eventDataProps={taskList}
            eventKeyName="due"
            hasEventProps={hasEvents}
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
          <Grid item xs={12}>
            <Typography variant="h4">Task list</Typography>
          </Grid>
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12} md={8} lg={7}>
              {days.length > 0 && filterBy === FILTER_BY.wholeMonth ? (
                <>
                  <Typography className={clsx(subheaderFont.className, "sub-header-font")} sx={{display:"inline"}}>
                    {format(days[0], "dd-MMM-yyyy")}
                  </Typography>
                  <Typography variant="h6" sx={{display:"inline", marginInline:"1rem"}}>to</Typography>

                  <Typography className={clsx(subheaderFont.className, "sub-header-font")}  sx={{display:"inline"}}>
                    {format(days[days.length - 1], "dd-MMM-yyyy")}
                  </Typography>
                </>
              ) : (
                <Typography className={clsx(subheaderFont.className, "sub-header-font")} sx={{display:"inline"}}>
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
                sx={{ backgroundColor: DARK_COLOR, color:"white" }}
                onClick={() => {
                    setHasEvents("has events on button click")
                    setFilterBy(FILTER_BY.wholeMonth)
                }}
              >
                Full Month
              </Button>
            </Grid>
            <Grid container item xs={12} spacing={2}>
              {taskList && taskList.length > 0 ? (
                taskList.map((task: TaskModel, index) => {
                  return (
                    <Grid key={index} item xs={12} md={4} lg={3}>
                      <ColorCard task={task} />
                    </Grid>
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
    </Grid>
  );
};

export default CalendarTask;
