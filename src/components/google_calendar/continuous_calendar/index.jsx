import React, { useEffect, useMemo, useRef, useState } from 'react';
import { updateData } from '../../../service/updateFirebase';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const ContinuousCalendar = ({ onClick, limitPlan, events,setEvents }) => {
  const today = new Date();
  const dayRefs = useRef([]);
  const [year, setYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [eventChange, setEventChange] = useState(false);

  // Sync events with event prop
  useEffect(() => {
    setEvents(events || {});
  }, [events]);

  // Sync events to Firebase whenever events change and eventChange is true
  useEffect(() => {
    const syncEvents = async () => {
      if (eventChange) {
        try {
          await updateData("", { event: events }, "");
          setEventChange(false);
        } catch (error) {
          console.error("Failed to sync events:", error);
        }
      }
    };
    syncEvents();
  }, [events, eventChange]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (eventChange) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [eventChange]);

  // IntersectionObserver for month selection
  useEffect(() => {
    const container = document.querySelector('.calendar-container');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const month = parseInt(entry.target.dataset.month, 10);
            if (!isNaN(month)) setSelectedMonth(month);
          }
        }
      },
      { root: container, rootMargin: '-75% 0px -25% 0px', threshold: 0 }
    );

    dayRefs.current.forEach((ref) => {
      if (ref?.dataset.day === '15') observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const monthOptions = monthNames.map((name, index) => ({ name, value: `${index}` }));

  const scrollToDay = (monthIndex, dayIndex) => {
    const targetIndex = dayRefs.current.findIndex(
      (ref) =>
        ref?.dataset.month === `${monthIndex}` && ref?.dataset.day === `${dayIndex}`
    );

    const targetElement = dayRefs.current[targetIndex];
    if (!targetElement) return;

    const container = document.querySelector('.calendar-container');
    const elementRect = targetElement.getBoundingClientRect();
    const is2xl = window.matchMedia('(min-width: 1536px)').matches;
    const offsetFactor = is2xl ? 3 : 2.5;

    if (container) {
      const containerRect = container.getBoundingClientRect();
      const offset = elementRect.top - containerRect.top - (containerRect.height / offsetFactor) + (elementRect.height / 2);
      container.scrollTo({ top: container.scrollTop + offset, behavior: 'smooth' });
    } else {
      const offset = window.scrollY + elementRect.top - (window.innerHeight / offsetFactor) + (elementRect.height / 2);
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  const handlePrevYear = () => setYear((y) => y - 1);
  const handleNextYear = () => setYear((y) => y + 1);
  const handleMonthChange = (e) => {
    const month = parseInt(e.target.value, 10);
    setSelectedMonth(month);
    scrollToDay(month, 1);
  };
  const handleTodayClick = () => {
    setYear(today.getFullYear());
    scrollToDay(today.getMonth(), today.getDate());
  };

  const handleDayClick = (day, month, y) => {
    if (!onClick) return;
    const formattedDate = `${y}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(formattedDate);
    onClick(day, month, y);
  };

  const handleEventDragStart = (e, date, content) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ content, date }));
  };

  const handleEventDrop = (e, day, month, y) => {
    e.preventDefault();
    const eventData = JSON.parse(e.dataTransfer.getData('text/plain'));
    const newDate = `${y}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    setEvents((prev) => {
      const updatedEvents = { ...prev };
      const existingEvents = updatedEvents[eventData.date] || [];
      const updatedEventList = existingEvents.filter(event => event.content !== eventData.content);

      updatedEvents[eventData.date] = updatedEventList.length > 0 ? updatedEventList : [];
      updatedEvents[newDate] = [...(updatedEvents[newDate] || []), { content: eventData.content }];

      return updatedEvents;
    });
    setEventChange(true);
  };

  const handleEventDoubleClick = (content, date) => {
    setEventToDelete({ content, date });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteEvent = () => {
    setEvents((prev) => {
      const updatedEvents = { ...prev };
      const eventList = updatedEvents[eventToDelete.date] || [];
      updatedEvents[eventToDelete.date] = eventList.filter(event => event.content !== eventToDelete.content);
      if (updatedEvents[eventToDelete.date].length === 0) {
        delete updatedEvents[eventToDelete.date];
      }
      return updatedEvents;
    });
    setIsDeleteModalOpen(false);
    setEventToDelete(null);
    setEventChange(true);
  };

  const generateCalendar = useMemo(() => {
    const daysInYear = () => {
      const result = [];
      const startDayOfWeek = new Date(year, 0, 1).getDay();

      // Filler days for previous year
      if (startDayOfWeek > 0) {
        const prevYear = year - 1;
        const prevMonthDays = new Date(year, 0, 0).getDate();
        for (let i = startDayOfWeek; i > 0; i--) {
          result.push({ month: -1, day: prevMonthDays - i + 1, year: prevYear });
        }
      }

      // Days for current year
      for (let month = 0; month < 12; month++) {
        const days = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= days; day++) {
          result.push({ month, day, year });
        }
      }

      // Filler days for next year
      const lastWeekDayCount = result.length % 7;
      if (lastWeekDayCount > 0) {
        const extra = 7 - lastWeekDayCount;
        for (let i = 1; i <= extra; i++) {
          result.push({ month: 0, day: i, year: year + 1 });
        }
      }

      return result;
    };

    const calendarDays = daysInYear();
    const calendarWeeks = [];

    for (let i = 0; i < calendarDays.length; i += 7) {
      calendarWeeks.push(calendarDays.slice(i, i + 7));
    }

    return calendarWeeks.map((week, wIdx) => (
      <div className="flex w-full" key={`week-${wIdx}`}>
        {week.map(({ month, day, year: dayYear }, dIdx) => {
          const index = wIdx * 7 + dIdx;
          const isToday = today.getFullYear() === dayYear && today.getMonth() === month && today.getDate() === day;
          const isNewMonth = index === 0 || calendarDays[index - 1].month !== month;
          const dateKey = month >= 0 ? `${dayYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;

          return (
            <div
              key={`${month}-${day}-${dayYear}`}
              ref={(el) => { dayRefs.current[index] = el; }}
              data-month={month}
              data-day={day}
              onClick={() => handleDayClick(day, month, dayYear)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleEventDrop(e, day, month, dayYear)}
              className={`relative z-10 m-[-0.5px] group aspect-square w-full grow cursor-pointer rounded-xl border font-medium transition-all hover:z-20 hover:border-cyan-400 sm:-m-px sm:size-20 sm:rounded-2xl sm:border-2 lg:size-36 lg:rounded-3xl 2xl:size-40`}
            >
              <span className={`absolute left-1 top-1 flex size-5 items-center justify-center rounded-full text-xs sm:size-6 sm:text-sm lg:left-2 lg:top-2 lg:size-8 lg:text-base ${isToday ? 'bg-blue-500 font-semibold text-white' : ''} ${month < 0 ? 'text-slate-400' : 'text-slate-800 dark:text-white'}`}>
                {day}
              </span>
              <div className='overflow-y-scroll lg:mt-10 mx-2 lg:max-h-20 max-h-10 z-999 scrollbar-hide'>
                {dateKey && events && events[dateKey]?.map((event, idx) => (
                  <div
                    key={idx}
                    onDragStart={(e) => handleEventDragStart(e, dateKey, event.content)}
                    onDoubleClick={() => handleEventDoubleClick(event.content, dateKey)}
                    draggable
                    className="mb-2 last:mb-0 px-1 text-xs truncate whitespace-break-spaces text-blue-600 dark:text-white bg-blue-600/30 p-1 text-center rounded-lg"
                  >
                    {event.content}
                  </div>
                ))}
              </div>
              {isNewMonth && month >= 0 && (
                <span className="absolute bottom-0.5 left-0 w-full truncate px-1.5 text-sm font-semibold text-slate-300 sm:bottom-0 sm:text-lg lg:bottom-2.5 lg:left-3.5 lg:-mb-1 lg:w-fit lg:px-0 lg:text-xl 2xl:mb-[-4px] 2xl:text-2xl">
                  {monthNames[month]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    ));
  }, [year, events]);

  const addPlan = () => {
    if (!selectedDate) {
      alert('Please select a day first');
      return;
    }

    const totalEvents = events ? Object.values(events).reduce((sum, eventList) => sum + (eventList?.length || 0), 0) : 0;
    
    if (totalEvents >= 50) {
      limitPlan();
      return;
    }

    setIsModalOpen(true);
  };

  return (
    <div className={`no-scrollbar calendar-container max-h-full hidden lg:block overflow-y-scroll rounded-2xl bg-white text-slate-800 dark:bg-slate-900 dark:text-slate-400 pb-10 shadow-xl`}>
      <div className="sticky -top-px z-50 w-full rounded-t-2xl bg-white dark:bg-slate-900 px-5 pt-7 sm:px-8 sm:pt-8">
        <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-6">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Select name="month" value={`${selectedMonth}`} options={monthOptions} onChange={handleMonthChange} />
            <button onClick={handleTodayClick} type="button" className="rounded-lg border border-gray-300 bg-white text-gray-900 dark:bg-slate-900 dark:text-white px-3 py-1.5 text-sm font-medium hover:bg-gray-100 lg:px-5 lg:py-2.5">
              Today
            </button>
            <button 
              onClick={addPlan}
              className="btn-ghost rounded-lg border border-gray-300 bg-white text-gray-900 dark:bg-slate-900 dark:text-white px-3 py-1.5 text-sm font-medium hover:bg-gray-100 lg:px-5 lg:py-2.5"
            >
              Add Plan
            </button>
          </div>
          <div className="flex w-fit items-center gap-2">
            <button onClick={handlePrevYear} className="rounded-full border p-2 hover:bg-slate-100 dark:hover:bg-slate-600">
              ←
            </button>
            <h1 className="text-lg font-semibold">{year}</h1>
            <button onClick={handleNextYear} className="rounded-full border p-2 hover:bg-slate-100 dark:hover:bg-slate-600">
              →
            </button>
          </div>
        </div>
        <div className="grid w-full grid-cols-7 justify-between text-slate-500">
          {daysOfWeek.map((day) => (
            <div key={day} className="w-full border-b border-slate-200 py-2 text-center font-semibold">
              {day}
            </div>
          ))}
        </div>
      </div>
      <div className="w-full px-5 pt-4 sm:px-8 sm:pt-6">
        {generateCalendar}
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 w-96">
            <h2 className="text-lg font-semibold">Add Plan for {selectedDate}</h2>
            <input
              type="text"
              placeholder="Event Title"
              className="w-full p-2 border rounded"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              maxLength={20}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (!newEventTitle) return;
                  setEvents((prev) => ({
                    ...prev,
                    [selectedDate]: [...(prev[selectedDate] || []), { content: newEventTitle }],
                  }));
                  setNewEventTitle('');
                  setIsModalOpen(false);
                  setEventChange(true);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 w-96">
            <h2 className="text-lg font-semibold">Confirm Delete Event</h2>
            <p>Are you sure you want to delete the event "{eventToDelete.content}"?</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button 
                onClick={handleDeleteEvent}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Select = ({
  name, value, label, options, onChange, className = '',
}) => (
  <div className={`relative ${className}`}>
    {label && (
      <label htmlFor={name} className="mb-2 block font-medium text-slate-800">
        {label}
      </label>
    )}
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="cursor-pointer rounded-lg border border-gray-300 bg-white text-gray-900 dark:bg-slate-900 dark:text-white py-1.5 pl-2 pr-6 text-sm font-medium hover:bg-gray-100 sm:rounded-xl sm:py-2.5 sm:pl-3 sm:pr-8"
    >
      {options.map(({ name, value }) => (
        <option key={value} value={value}>
          {name}
        </option>
      ))}
    </select>
    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
      <svg className="size-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clipRule="evenodd" />
      </svg>
    </span>
  </div>
);