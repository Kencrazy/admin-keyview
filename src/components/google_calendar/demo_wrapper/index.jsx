'use client';

import React, { useState } from "react";
import { useSnack } from "../snack_provider";
import { ContinuousCalendar } from "../continuous_calendar";

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function DemoWrapper({event}) {
  const { createSnack } = useSnack();

  const onClickHandler = (day, month, year) => {
    const snackMessage = `Clicked on ${monthNames[month]} ${day}, ${year}`;
    createSnack(snackMessage, 'success');
  };

  const limitPlan = ()=>{
    const snackMessage = 'Exceeding limit 50 events'
    createSnack(snackMessage,'error')
  }

  return (
    <div className="relative hidden  lg:flex h-screen max-h-screen w-full flex-col gap-4 px-4 items-center justify-center">
      <div className="relative h-full overflow-auto">
        <ContinuousCalendar onClick={onClickHandler} limitPlan={limitPlan} event={event}/>
      </div>
    </div>
  );
}
