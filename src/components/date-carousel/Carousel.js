import styles from './Carousel.module.scss';
import { useState, useRef, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';

import LeftIcon from '../../assets/icons/Left.svg';
import RightIcon from '../../assets/icons/Right.svg';

export default function Carousel({
   handleDateFilterMonth,
   filterDates,
   carouselData,
   handleDateFilterWeek,
   value,
   setValue
}) {
   // states
   const [calendarOpen, setCalendarOpen] = useState(false);

   const wrapperRef = useRef(null);

   useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setCalendarOpen(false);
         }
      }

      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
         // Unbind the event listener on clean up
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, [wrapperRef]);

   const today = new Date();
   const currentDate = moment(today).format('MMM Do YY');
   const currentSelectedDate = moment(value).format('MMM Do YY');

   const clickToday = value => {
      setValue(today);
      if (value === 'day') {
         filterDates(today);
      } else if (value === 'week') {
         handleDateFilterWeek(today);
      } else if (value === 'month') {
         handleDateFilterMonth(today);
      }
   };

   const nextDay = () => {
      const nextValue = new Date(moment(value).add(1, 'days'));
      setValue(nextValue);
      filterDates(nextValue);
   };

   const nextWeek = () => {
      const nextWeekValue = new Date(moment(value).add(7, 'days'));
      setValue(nextWeekValue);
      handleDateFilterWeek(nextWeekValue);
   };

   const nextMonth = () => {
      const nextMonthValue = new Date(moment(value).add(1, 'months'));
      setValue(nextMonthValue);
      handleDateFilterMonth(nextMonthValue);
   };

   const prevDay = () => {
      const prevValue = new Date(moment(value).subtract(1, 'days'));
      setValue(prevValue);
      filterDates(prevValue);
   };

   const prevWeek = () => {
      const prevWeekValue = new Date(moment(value).subtract(7, 'days'));
      setValue(prevWeekValue);
      handleDateFilterWeek(prevWeekValue);
   };

   const prevMonth = () => {
      const prevMonthValue = new Date(moment(value).subtract(1, 'months'));
      setValue(prevMonthValue);
      handleDateFilterMonth(prevMonthValue);
   };

   const onClickDay = value => {
      setValue(value);
      if (carouselData === 'day') {
         filterDates(value);
      } else if (carouselData === 'week') {
         handleDateFilterWeek(value);
      } else if (carouselData === 'month') {
         handleDateFilterMonth(value);
      }
   };

   const lastYear = () => {
      const lastYearvalue = new Date(moment(value).subtract(365, 'days'));
      setValue(lastYearvalue);
      if (carouselData === 'day') {
         filterDates(lastYearvalue);
      } else if (carouselData === 'week') {
         handleDateFilterWeek(lastYearvalue);
      } else if (carouselData === 'month') {
         handleDateFilterMonth(lastYearvalue);
      }

      //   const testingWeek = moment(lastYearvalue).startOf("week")
   };

   const checkFilterNext = () => {
      if (carouselData === 'day') {
         nextDay();
      } else if (carouselData === 'week') {
         nextWeek();
      } else if (carouselData === 'month') {
         nextMonth();
      }
   };

   const checkFilterPrev = () => {
      if (carouselData === 'day') {
         prevDay();
      } else if (carouselData === 'week') {
         prevWeek();
      } else if (carouselData === 'month') {
         prevMonth();
      }
   };

   return (
      <div className={styles.daddyWrapper}>
         <div className={styles.carouselContainer}>
            <div className={styles.carouselWrapper}>
               <button onClick={checkFilterPrev} className={styles.leftArrow}>
                  <img src={LeftIcon} alt='left' width='5' height='8' />
               </button>
               <div className={styles.carouselContentWrapper}>
                  <div
                     className={styles.carouselContent}
                     onClick={() => {
                        setCalendarOpen(true);
                     }}
                  >
                     <p>{moment(value).format('ddd, MMM Do, YYYY')}</p>
                  </div>
               </div>
               <button onClick={checkFilterNext} className={styles.rightArrow}>
                  <img src={RightIcon} alt='left' width='5' height='8' />
               </button>
            </div>
            <br />
         </div>
         {calendarOpen ? (
            <div ref={wrapperRef}>
               <Calendar onClickDay={onClickDay} value={value} className={styles.reactCalendar} />
            </div>
         ) : null}
      </div>
   );
}

// handleDateFilterMonth, filterDates, selectedDate, carouselData, handleDateFilterWeek, value, setValue

Carousel.propTypes = {
   handleDateFilterMonth: PropTypes.func.isRequired,
   filterDates: PropTypes.func.isRequired,
   carouselData: PropTypes.string.isRequired,
   handleDateFilterWeek: PropTypes.func.isRequired,
   value: PropTypes.any.isRequired,
   setValue: PropTypes.func.isRequired
};

// function useOnClickOutside (ref, handler) {
//    useEffect(
//       () => {
//          const listener = (event) => {
//          // Do nothing if clicking ref's element or descendent elements
//             if (!ref.current || ref.current.contains(event.target)) {
//                return
//             }
//             handler(event)
//          }
//          document.addEventListener("click", listener)
//          document.addEventListener("touchstart", listener)
//          return () => {
//             document.removeEventListener("click", listener)
//             document.removeEventListener("touchstart", listener)
//          }
//       },
//       // Add ref and handler to effect dependencies
//       // It's worth noting that because passed in handler is a new ...
//       // ... function on every render that will cause this effect ...
//       // ... callback/cleanup to run every render. It's not a big deal ...
//       // ... but to optimize you can wrap handler in useCallback before ...
//       // ... passing it into this hook.
//       [ref, handler]
//    )
// }
// This is how you format dates in 00/00/0000 style. ("MM/DD/YYYY")
