import React, { useEffect, useState } from "react";
import "./clock.css";

function Clock() {
  const [date, setDate] = useState(new Date());
  function updateTime() {
    setDate(new Date());
  }

  useEffect(() => {
    const timerId = setInterval(updateTime, 1000);
    return function cleanup() {
      clearInterval(timerId);
    };
  }, []);

  return (
    <div className="clock-container">
      <p className="date-time">
        {date.toLocaleString("default", { month: "long" })} {date.getDay()},{" "}
        {date.getFullYear()}
        <br />
        {date.toLocaleTimeString()}
      </p>
    </div>
  );
}
export default Clock;
