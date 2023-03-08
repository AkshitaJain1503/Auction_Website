import React , { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  SevenColGrid,
  Wrapper,
  HeadDays,
  DateControls,
  StyledEvent,
  SeeMore,
  PortalWrapper
} from "./Calendar.styled";
import Conts, { DAYS, MOCKAPPS } from "./conts";
import {
  datesAreOnSameDay,
  // getDarkColor,
  getDaysInMonth,
  getMonthYear,
  getSortedDays,
  nextMonth,
  prevMonth
  // range,
  // sortDays
} from "./utils";

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2022, 9, 1));
  const [events, setEvents] = useState(MOCKAPPS);
  // const dragDateRef = useRef();
  // const dragindexRef = useRef();
  const [showPortal, setShowPortal] = useState(false);
  const [portalData, setPortalData] = useState({});

  //=================
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const name = query.get('name');
  // const [events, setEvents] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const aucs=[];

  // GET request for getting the auction events
useEffect(() => {
  console.log("eve", MOCKAPPS);
  fetch("http://localhost:3001/api/getAllStartDaysCalendar?name=" + name , {
        headers: { "Authorization": "Bearer "+localStorage.getItem("token")}
      })
    .then(response => response.json())
    .then(data => 
      {
        console.log("data", data.data);
        // setEvents(data.data);
        setAuctions(data.data);
        // console.log("la", auctions.length);
        
        
        // Conts(auctions);
        
      }
    )
    .catch(error => console.error(error));
}, []);
// const [events, setEvents] = useState([]);

// useEffect( () =>{
//   // Conts(auctions);
//   for(var i=0; i<auctions.length; i++)
//         {
//           events.push( new Date(auctions[i].date) );
//         }
//         console.log("auc", events);
// }, [auctions] );

// console.log("auc", auctions);


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
    setPortalData(event);
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
        > &lt;= </ion-icon>
        {getMonthYear(currentDate)}
        <ion-icon
          onClick={() => nextMonth(currentDate, setCurrentDate)}
          name="arrow-forward-circle-outline"
        >=&gt;</ion-icon>
      </DateControls>

      {/* // days */}

      <SevenColGrid>
        
        {DAYS.map((day) => (
          <HeadDays className="nonDRAG">{day}</HeadDays>
        ))}
      </SevenColGrid>

      <SevenColGrid
        fullheight={true}
        is28Days={getDaysInMonth(currentDate) === 28}
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
                    ev.date,
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
                      id={`${ev.color} ${ev.title}`}
                      key={ev.title}
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
        {children.filter((child) => child).length > 2 && (
          <SeeMore
            onClick={(e) => {
              e.stopPropagation();
              console.log("clicked p");
            }}
          >
            see more...
          </SeeMore>
        )}
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

