import React , {  useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../navbar/index";
import {
  SevenColGrid,
  Wrapper,
  HeadDays,
  DateControls,
  StyledEvent,
  SeeMore,
  View
} from "./Calendar.styled";
import {
  datesAreOnSameDay,
  getDaysInMonth,
  getMonthYear,
  getSortedDays,
  nextMonth,
  prevMonth
} from "./utils";

export const Calendar = () => {
  const navigate = useNavigate();

  const DAYS = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
  const [currentDate, setCurrentDate] = useState(new Date());

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const name = query.get('name');
  const [events, setEvents] = useState([]);

// GET request for getting the auction start dates
useEffect(() => {
  fetch("http://localhost:3001/api/calendar?name=" + name )
    .then(response => response.json())
    .then(data => 
      {
        setEvents(data.data);
      }
    )
    .catch(error => console.error(error));
}, []);

  const handleOnClickEvent = (eventDate) => {
    const date= new Date(eventDate).toISOString() ;
    const seperatedDate= date.split("T");
    const dateOnly= seperatedDate[0];
    navigate(`/calendarDetails?name=${name}&date=${dateOnly}`  );
  };

  const EventWrapper = ({date, children }) => {
    const childLength= children.filter((child) => child).length; // number of results on this date
    if (childLength)
      return (
        <>
          {children}
          {childLength > 2 && (
            <SeeMore >
              +{childLength-2} more
            </SeeMore>
          )}
          <View onClick={() => 
              handleOnClickEvent(date) }> Expand </View>
        </>
      );
  };


  return (
    <div >
    <NavBar/>
    <h1>Search results for "{name}"</h1>
    <hr/>
    <Wrapper >
      {/* <= month => */}
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

      {/* mon tue ... */}

      <SevenColGrid>
        
        {DAYS.map((day) => (
          <HeadDays className="nonDRAG">{day}</HeadDays>
        ))}
      </SevenColGrid>

      {/* dates grid */}

      <SevenColGrid
        fullheight={true}
        is28Days={getDaysInMonth(currentDate) === 28}
      >
        {getSortedDays(currentDate).map((day) => (
          <div
            id={`${currentDate.getFullYear()}/${currentDate.getMonth()}/${day}`}
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
            <EventWrapper date={new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    day+1
                  )} >
              
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
                      // onClick={() => handleOnClickEvent(ev.date)}
                      className="StyledEvent"
                      id={`${ev.color}`}
                      key={ev.id}
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
              
    </Wrapper>
    </div>
  );
};


