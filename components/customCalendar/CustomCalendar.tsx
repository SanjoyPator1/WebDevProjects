"use client";
import React, { FC, memo, useEffect } from "react";
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

interface CalendarProps {
  currentMonthProp?: string;
  setCurrentMonthProp?: React.Dispatch<React.SetStateAction<string>>;
  setDaysProp?: React.Dispatch<React.SetStateAction<Date[]>>;
  onDateClick?: (date: Date) => void | Date;
  eventDataProps?: any[];
  eventKeyName?: string;
  hasEventProps?:string;
}

const CustomCalendar: FC<CalendarProps> = ({
  currentMonthProp,
  setCurrentMonthProp,
  setDaysProp,
  onDateClick,
  eventDataProps,
  eventKeyName,
  hasEventProps
}) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let today = startOfToday()
  let [selectedDay, setSelectedDay] = useState(today)
  let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
  let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())
  const [eventData,setEventData] = useState(eventDataProps)

  let initialDaysData = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  })

  const [days, setDays] = useState<Date[]>(initialDaysData);

  useEffect(() => {
    console.log("setting days")
    const daysData = eachDayOfInterval({
      start: startOfWeek( parse(currentMonth, 'MMM-yyyy', new Date())),
      end: endOfWeek(endOfMonth( parse(currentMonth, 'MMM-yyyy', new Date()))),
    });
    setDays(daysData)
    setDaysProp && setDaysProp(daysData);
  }, [currentMonth, setDaysProp]);


  //update eventData
  useEffect(()=>{
    setEventData(eventDataProps)
  }, [eventDataProps])

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  const handleOnDateClick = (day: Date) => {
    setSelectedDay(day);
    onDateClick && onDateClick(day);
  };

  console.log("custom calendar called");
  console.log("eventDataProp",eventDataProps)
  console.log("eventData",eventData)

  return (
    <>
      <div className="calendar-container">
         Child : {hasEventProps && hasEventProps}
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
          {days && days.map((day, index) => {
            return (
              <div key={index}>
                <button
                  className={clsx(
                    "bootstrap-button",
                    isToday(day) && "is-today",
                    isSameMonth(day, firstDayCurrentMonth) && "is-same-month",
                    isEqual(day, selectedDay) && "is-equal"
                  )}
                  onClick={() => handleOnDateClick(day)}
                  style={{ gridColumnStart: getDay(day) + 1 }}
                >
                  <time dateTime={format(day, "yyyy-MM-dd")}>
                    {format(day, "d")}
                  </time>
                </button>
                <div
                  style={{
                    width: "5px",
                    height: "5px",
                    margin: "auto",
                    marginTop: "1px",
                  }}
                >
                  {eventData &&
                    eventKeyName &&
                    eventData.some((event) => {
                      console.log("checking event for ", event[eventKeyName]);
                      return isSameDay(parseISO(event[eventKeyName]), day);
                    }) && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          backgroundColor: "#3B82F6",
                        }}
                      ></div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default memo(CustomCalendar, (prev, next) => {
  return (
    prev.currentMonthProp === next.currentMonthProp
  );
});
