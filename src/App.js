import axios from "axios";
import "./App.css";
import { useState, useEffect } from "react";
import st from "./st.svg";
function App() {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const [val, setVal] = useState([]);
  const [notVal, setNotVal] = useState(currentMonth.toString());
  const [extVal, setExtVal] = useState(currentYear.toString());
  const [isGregorian, setIsGregorian] = useState(true);
  useEffect(() => {
    const fetching = async () => {
      try {
        const response = await axios.get(
          `https://api.aladhan.com/v1/gToHCalendar/${notVal}/${extVal}`
        );
        setVal(response.data.data);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
      }
    };

    fetching();
  }, [notVal, extVal]);

  const handleMonthChange = (e) => {
    setNotVal(e.target.value);
  };

  const handleYearChange = (i) => {
    setExtVal(i.target.value);
  };

  const toggleCalendarType = () => {
    setIsGregorian(!isGregorian);
    setNotVal(today.getMonth() + 1);
  };

  const setToday = () => {
    setNotVal(today.getMonth() + 1);
    setExtVal(today.getFullYear());
  };

  const renderCalendar = () => {
    if (val.length === 0) return null;

    const firstDayOfWeek = new Date(val[0].gregorian.date).getDay();
    const placeholders = Array(firstDayOfWeek).fill(null);

    return (
      <>
        {placeholders.map((_, index) => (
          <span key={`empty-${index}`} className="empty"></span>
        ))}
        {val.map((day, index) => (
          <div key={index} className="date-cell">
            {isGregorian ? (
              <div className="ext">
                <div className="gregorian">
                  <p>{day.gregorian.day}</p>
                </div>
                <div className="hijri">
                  <p>{day.hijri.day}</p>
                </div>
              </div>
            ) : (
              <div className="ext">
                <div className="hijri">
                  <p>{day.hijri.day}</p>
                </div>
                <div className="gregorian">
                  <p>{day.gregorian.day}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </>
    );
  };

  const renderMonthsOptions = () => {
    const gregorianMonths = [
      { value: "1", name: "January" },
      { value: "2", name: "February" },
      { value: "3", name: "March" },
      { value: "4", name: "April" },
      { value: "5", name: "May" },
      { value: "6", name: "June" },
      { value: "7", name: "July" },
      { value: "8", name: "August" },
      { value: "9", name: "September" },
      { value: "10", name: "October" },
      { value: "11", name: "November" },
      { value: "12", name: "December" },
    ];

    const hijriMonths = [
      { value: "1", name: "Muharram" },
      { value: "2", name: "Safar" },
      { value: "3", name: "Rabi' al-awwal" },
      { value: "4", name: "Rabi' al-thani" },
      { value: "5", name: "Jumada al-awwal" },
      { value: "6", name: "Jumada al-thani" },
      { value: "7", name: "Rajab" },
      { value: "8", name: "Sha'ban" },
      { value: "9", name: "Ramadan" },
      { value: "10", name: "Shawwal" },
      { value: "11", name: "Dhu al-Qi'dah" },
      { value: "12", name: "Dhu al-Hijjah" },
    ];

    const months = isGregorian ? gregorianMonths : hijriMonths;

    return months.map((month) => (
      <option key={month.value} value={month.value}>
        {month.name}
      </option>
    ));
  };

  const renderYearsOptions = () => {
    const currentYear = new Date(1950).getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear + i);
    return years.map((year) => (
      <option key={year} value={year}>
        {year}
      </option>
    ));
  };
  const getDateRange = () => {
    const months = isGregorian
      ? [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ]
      : [
          "Muharram",
          "Safar",
          "Rabi' al-awwal",
          "Rabi' al-thani",
          "Jumada al-awwal",
          "Jumada al-thani",
          "Rajab",
          "Sha'ban",
          "Ramadan",
          "Shawwal",
          "Dhu al-Qi'dah",
          "Dhu al-Hijjah",
        ];

    const monthIndex = parseInt(notVal, 10) - 1;
    const currentMonthName = months[monthIndex];
    const nextMonthName = months[(monthIndex + 1) % months.length];

    return `${currentMonthName} ${extVal} - ${nextMonthName} ${extVal}`;
  };

  return (
    <>
      <div className="main">
        <h1>Hijri & Gregorian Calender</h1>
            <div className="details">
              <button onClick={toggleCalendarType}>
                <img src={st} alt="" />
              </button>
              <p> Switch to {isGregorian ? "Hijri" : "Gregorian"}</p>
            </div>
        <div className="top">
          <div className="left">
            <div className="view">
              {isGregorian ? (
                <p> Month: {getDateRange()}</p>
              ) : (
                <p>Month: {getDateRange()}</p>
              )}
            </div>
          </div>
          <div className="right">
            <button onClick={setToday}>Today</button>
            <select value={notVal} onChange={handleMonthChange} name="months">
              {renderMonthsOptions()}
            </select>
            <select value={extVal} onChange={handleYearChange} name="years">
              {renderYearsOptions()}
            </select>
          </div>
        </div>

        <div className="box">
          <div className="days">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>
          <div className="dates">{renderCalendar()}</div>
        </div>
      </div>
    </>
  );
}

export default App;
