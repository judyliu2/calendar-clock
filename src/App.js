import "react-tabs/style/react-tabs.css";
import "./App.css";
import Clock from "./components/clock";
import React, { useEffect, useMemo, useState } from "react";
import testData from "./TEST_DATA.json";
import DataTable from "./components/DataTable";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";

function App() {
  const [bugs, setBugs] = useState(() => {
    const localBugs = localStorage.getItem("bugList");
    return localBugs !== null ? JSON.parse(localBugs) : [];
  });

  const [region, setRegion] = useState("northern");
  const date = new Date();
  const data = useMemo(() => testData, []);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: `id`,
      },
      {
        Header: "First Name",
        accessor: `first_name`,
      },
      {
        Header: "Last Name",
        accessor: `last_name`,
      },
      {
        Header: "Email",
        accessor: `email`,
      },
      {
        Header: "Gender",
        accessor: `gender`,
      },
      {
        Header: "University",
        accessor: `university`,
      },
    ],
    []
  );

  //check if a given time is between two times
  function isAvailable(dateString) {
    if (dateString === "") {
      return true;
    }
    const times = dateString.replace(/\s/g, "").split("&");
    for (const time of times) {
      const intervals = time.split("-");
      const start = intervals[0];
      const end = intervals[1];
      //  check if intervals goes to next day
      let isNextDay = start.includes("pm") && end.includes("am") ? 1 : 0;
      let startHour = parseInt(start.substring(0, start.length - 2));
      let endHour = parseInt(end.substring(0, end.length - 2));

      if (start.includes("pm")) {
        startHour += 12;
      } else if (end.includes("pm")) {
        endHour += 12;
      }
      let startTime = new Date();
      startTime.setHours(startHour);
      startTime.setMinutes(0);
      let endTime = new Date();
      endTime.setDate(endTime.getDate() + isNextDay);
      endTime.setHours(endHour);
      endTime.setMinutes(0);

      if (date > startTime && date < endTime) {
        return true;
      }
    }

    return false;
  }

  const bugColumns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: `name.name-USen`,
      },
      {
        Header: "Image",
        Cell: (tableProps) => (
          <img src={tableProps.row.original.image_uri} width={60} />
        ),
      },
      {
        Header: "Months Available",
        accessor: `availability.month-array-northern`,
        width: 200,
        Cell: (tableProps) => (
          <span>
            {tableProps.row.original["availability"]["month-array-northern"]
              .map((month) => months[month - 1])
              .join(" ")}
          </span>
        ),
      },
      {
        Header: "Times",
        accessor: `availability.time`,
        Cell: (tableProps) => (
          <div>
            <span>
              {tableProps.row.original["availability"]["isAllDay"]
                ? "All day"
                : tableProps.row.original["availability"]["time"]}
            </span>
          </div>
        ),
      },
      {
        Header: "Location",
        accessor: `availability.location`,
      },
      {
        Header: "Rarity",
        accessor: `availability.rarity`,
      },
      {
        Header: "Price",
        accessor: `price`,
      },
    ],
    []
  );

  // function getTime(time) => {
  //   return
  // } check for time

  const fetchBugData = () => {
    fetch("https://acnhapi.com/v1/bugs/")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const bugList = Object.values(data);
        localStorage.setItem("recipeList", JSON.stringify(bugList));
        bugList = bugList
          .filter((bug) =>
            bug["availability"]["month-array-northern"].includes(
              date.getMonth() + 1
            )
          )
          .filter((bug) => isAvailable(bug["availability"]["time"]));
        setBugs(bugList);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (bugs === []) {
      fetchBugData();
    }
  }, []);

  return (
    <div className="App">
      <Clock />
      <div className="table-container">
        <Tabs>
          <TabList>
            <Tab>Bugs</Tab>
            <Tab>Fish</Tab>
            <Tab>Sea Creatures</Tab>
          </TabList>

          <TabPanel>
            {bugs.length > 0 ? (
              <DataTable columns={bugColumns} data={bugs} />
            ) : (
              <span>No bug data found.</span>
            )}
          </TabPanel>
          <TabPanel>
            <h2>Fish</h2>
          </TabPanel>
          <TabPanel>
            <h2>Sea Creatures</h2>
          </TabPanel>
        </Tabs>
      </div>
      <div>
        Data is retrieved from <a href="https://acnhapi.com/">ANCH API</a>
      </div>
    </div>
  );
}

export default App;
