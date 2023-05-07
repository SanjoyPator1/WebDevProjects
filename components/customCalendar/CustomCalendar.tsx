"use client";
import React from "react";
import "./calendar-style.css";
import { Grid, Typography } from "@mui/material";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { Fragment, useState } from "react";
import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { BiLeftArrowAlt, BiRightArrowAlt } from "react-icons/bi";
import { formatDate } from "@/lib/functions";
import { DARK_BLUE_COLOR } from "@/lib/constants";
import clsx from "clsx";

interface BootstrapButtonProps extends ButtonProps {
  isToday?: boolean;
  isSameMonth?: boolean;
  isEqual?: boolean;
  index: number;
}

// const BootstrapButton = styled(Button)<BootstrapButtonProps>(
//   ({ theme, isToday, isSameMonth, isEqual, index }) => ({
//     boxShadow: "none",
//     textTransform: "none",
//     backgroundColor: "white",
//     borderRadius: "50%",
//     height: "2em",
//     width: "2em",
//     fontFamily: [
//       "-apple-system",
//       "BlinkMacSystemFont",
//       '"Segoe UI"',
//       "Roboto",
//       '"Helvetica Neue"',
//       "Arial",
//       "sans-serif",
//       '"Apple Color Emoji"',
//       '"Segoe UI Emoji"',
//       '"Segoe UI Symbol"',
//     ].join(","),
//     gridColumnStart: index,
//     color: isToday || isEqual ? "white" : isSameMonth ? "black" : "#808080",
//     backgroundColor: isToday ? "red" : isEqual ? DARK_BLUE_COLOR : "white",
//     "&:hover": {
//       backgroundColor: isToday ? "red" : "#0069d9",
//       color: "white",
//       boxShadow: "none",
//     },
//     "&:active": {
//       boxShadow: "none",
//       backgroundColor: isToday ? "red" : "black",
//       color: isToday ? "white" : "",
//     },
//     // "&:focus": {
//     //   boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
//     // },
//   })
// );

function CustomCalendar() {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  let days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  console.log(currentMonth)

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Simple Calendar
      </Typography>
      <div className="calendar-container">
        {/* Header - current date and prev next button */}
        <div className="header">
          <div className="header-date">
            <Typography variant="h6">
              {format(firstDayCurrentMonth, "MMMM yyyy")}
            </Typography>
          </div>
          <div className="header-buttons">
            <IconButton onClick={previousMonth}>
              <BiLeftArrowAlt />
            </IconButton>
            <IconButton onClick={nextMonth}>
              <BiRightArrowAlt />
            </IconButton>
          </div>
        </div>

        {/* Render days of week */}
        <div className="days-of-week">
          {daysOfWeek.map((day) => (
            <div className="day-of-week" key={day}>
              <Typography align="center" variant="subtitle1">
                {day}
              </Typography>
            </div>
          ))}
        </div>

        {/* Render days of month */}
        <div className="days-of-month">
          {days.map((day, index) => {
            return (
              <button key={index} className={clsx("bootstrap-button",isToday(day) && "is-today", isSameMonth(day, firstDayCurrentMonth) && "is-same-month", isEqual(day, selectedDay) && "is-equal" )} onClick={()=> setSelectedDay(day)} style={{gridColumnStart: getDay(day)+1}} >
                 <time dateTime={format(day, "yyyy-MM-dd")}>
                  {format(day, "d")}
                </time>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default CustomCalendar;

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
