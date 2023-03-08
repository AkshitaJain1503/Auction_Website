import React , {  useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  SevenColGrid,
  Wrapper,
  HeadDays,
  DateControls,
  StyledEvent,
  // SeeMore,
  PortalWrapper
} from "./Calendar.styled";
// import { DAYS, MOCKAPPS } from "./conts";
import {
  datesAreOnSameDay,
  // getDarkColor,
  // getDaysInMonth,
  getMonthYear,
  getSortedDays,
  nextMonth,
  prevMonth
  // range,
  // sortDays
} from "./utils";

export const Calendar = () => {

  const DAYS = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
  const [currentDate, setCurrentDate] = useState(new Date());
  // const dragDateRef = useRef();
  // const dragindexRef = useRef();
  const [showPortal, setShowPortal] = useState(false);
  const [portalData, setPortalData] = useState({});

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const name = query.get('name');
  const [events, setEvents] = useState([]);

// GET request for getting the auction start dates
useEffect(() => {
  fetch("http://localhost:3001/api/getAllStartDaysCalendar?name=" + name , {
        headers: { "Authorization": "Bearer "+localStorage.getItem("token")}
      })
    .then(response => response.json())
    .then(data => 
      {
        setEvents(data.data);
        
      }
    )
    .catch(error => console.error(error));
}, []);

  // const addEvent = (date, event) => {
  //   if (!event.target.classList.contains("StyledEvent")) {
  //     const text = window.prompt("name");
  //     if (text) {
  //       date.setHours(0);
  //       date.setSeconds(0);
  //       date.setMilliseconds(0);
  //       setEvents((prev) => [
  //         ...prev,
  //         { date, title: text, color: getDarkColor() }
  //       ]);
  //     }
  //   }
  // };

  // const drag = (index, e) => {
  //   dragindexRef.current = { index, target: e.target };
  // };

  // const onDragEnter = (date, e) => {
  //   e.preventDefault();
  //   dragDateRef.current = { date, target: e.target.id };
  // };

  // const drop = (ev) => {
  //   ev.preventDefault();

  //   setEvents((prev) =>
  //     prev.map((ev, index) => {
  //       if (index === dragindexRef.current.index) {
  //         ev.date = dragDateRef.current.date;
  //       }
  //       return ev;
  //     })
  //   );
  // };

  const handleOnClickEvent = (event) => {
    setShowPortal(true);
    setPortalData((event));
  };

  const handlePotalClose = () => setShowPortal(false);

  const handleDelete = () => {
    setEvents((prevEvents) =>
      prevEvents.filter((ev) => ev.title !== portalData.title)
    );
    handlePotalClose();
  };

  return (
    <Wrapper>
      
      {/* first line */}
      <DateControls>
        <ion-icon
          onClick={() => prevMonth(currentDate, setCurrentDate)}
          name="arrow-back-circle-outline"
        >  </ion-icon>
        {getMonthYear(currentDate)}
        <ion-icon
          onClick={() => nextMonth(currentDate, setCurrentDate)}
          name="arrow-forward-circle-outline"
        ></ion-icon>
      </DateControls>

      {/* // days */}

      <SevenColGrid>
        
        {DAYS.map((day) => (
          <HeadDays className="nonDRAG">{day}</HeadDays>
        ))}
      </SevenColGrid>

      <SevenColGrid
        fullheight={true}
        // is28Days={getDaysInMonth(currentDate) === 28}
      >
        {getSortedDays(currentDate).map((day) => (
          <div
            id={`${currentDate.getFullYear()}/${currentDate.getMonth()}/${day}`}
            // onDragEnter={(e) =>
            //   onDragEnter(
            //     new Date(
            //       currentDate.getFullYear(),
            //       currentDate.getMonth(),
            //       day
            //     ),
            //     e
            //   )
            // }
            // onDragOver={(e) => e.preventDefault()}
            // onDragEnd={drop}
            // onClick={(e) =>
            //   addEvent(
            //     new Date(
            //       currentDate.getFullYear(),
            //       currentDate.getMonth(),
            //       day
            //     ),
            //     e
            //   )
            // }
          >
            <span
              className={`nonDRAG ${
                datesAreOnSameDay(
                  new Date(),
                  new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day
                  )
                )
                  ? "active"
                  : ""
              }`}
            >
              {day}
            </span>
            <EventWrapper>
              {events.map(
                (ev, index) =>
                  datesAreOnSameDay(
                    (new Date(ev.date)),
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      day
                    )
                  ) && (
                    <StyledEvent
                      // onDragStart={(e) => drag(index, e)}
                      onClick={() => handleOnClickEvent(ev)}
                      // draggable
                      className="StyledEvent"
                      id={`${ev.color}`}
                      key={ev.date}
                      bgColor={ev.color}
                    >
                      {ev.title}
                    </StyledEvent>
                  )
              )}
            </EventWrapper>
          </div>
        ))}
      </SevenColGrid>
      {showPortal && (
        <Portal
          {...portalData}
          handleDelete={handleDelete}
          handlePotalClose={handlePotalClose}
        />
      )}
    </Wrapper>
  );
};

const EventWrapper = ({ children }) => {
  if (children.filter((child) => child).length)
    return (
      <>
        {children}
        {/* {children.filter((child) => child).length > 2 && (
          <SeeMore
            onClick={(e) => {
              e.stopPropagation();
              console.log("clicked p");
            }}
          >
            see more...
          </SeeMore>
        )} */}
      </>
    );
};

const Portal = ({ title, date, handleDelete, handlePotalClose }) => {
  return (
    <PortalWrapper>
      <h2>{title}</h2>
      <p>{date.toDateString()}</p>
      <ion-icon onClick={handleDelete} name="trash-outline"></ion-icon>
      <ion-icon onClick={handlePotalClose} name="close-outline"></ion-icon>
    </PortalWrapper>
  );
};

