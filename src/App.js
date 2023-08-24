import "react-tabs/style/react-tabs.css";
import "./App.css";
import Clock from "./components/clock";
import React, { useEffect, useMemo, useState } from "react";
import testData from "./TEST_DATA.json";
import DataTable from "./components/DataTable";
import { Tabs, TabList, TabPanel, Tab } from "react-tabs";
import axios from "axios";

function App() {
  const [bugs, setBugs] = useState([]);
  const [fish, setFish] = useState([]);
  const [seaCreatures, setSeaCreatures] = useState([]);
  const [region, setRegion] = useState("north");
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

  const bugColumns = useMemo(() => [
    {
      Header: "Name",
      Cell: (tableProps) => (
        <div className="creature-picture-format">
          <span>{tableProps.row.original.name}</span>
          <img src={tableProps.row.original.image_url} width={60} />
        </div>
      ),
    },
    {
      Header: "Months Available",
      accessor: `availability.month-array-northern`,
      width: 200,
      Cell: (tableProps) => (
        <span>{tableProps.row.original["north"]["months"]}</span>
      ),
    },
    {
      Header: "Times",
      accessor: `north.times_by_month.${date.getMonth() + 1}`,
    },
    {
      Header: "Location",
      accessor: `location`,
    },
  ]);

  const fishColumns = useMemo(() => [
    {
      Header: "Name",
      Cell: (tableProps) => (
        <div className="creature-picture-format">
          <span>{tableProps.row.original.name}</span>
          <img src={tableProps.row.original.image_url} width={60} />
        </div>
      ),
    },
    {
      Header: "Months Available",
      accessor: `availability.month-array-northern`,
      width: 200,
      Cell: (tableProps) => (
        <span>{tableProps.row.original["north"]["months"]}</span>
      ),
    },
    {
      Header: "Times",
      accessor: `north.times_by_month.${date.getMonth() + 1}`,
    },
    {
      Header: "Location",
      accessor: `location`,
    },
    {
      Header: "Shadow Size",
      accessor: `shadow_size`,
    },
  ]);

  const seaCreatureColumns = useMemo(() => [
    {
      Header: "Name",
      Cell: (tableProps) => (
        <div className="creature-picture-format">
          <span>{tableProps.row.original.name}</span>
          <img src={tableProps.row.original.image_url} width={60} />
        </div>
      ),
    },
    {
      Header: "Months Available",
      accessor: `availability.month-array-northern`,
      width: 200,
      Cell: (tableProps) => (
        <span>{tableProps.row.original["north"]["months"]}</span>
      ),
    },
    {
      Header: "Times",
      accessor: `north.times_by_month.${date.getMonth() + 1}`,
    },
    {
      Header: "Shadow Size",
      accessor: "shadow_size",
    },
    {
      Header: "Speed",
      accessor: "shadow_movement",
    },
  ]);

  const fetchBugData = () => {
    const options = {
      method: "GET",
      url: "http://localhost:8000/monthly-bugs",
      params: { month: date.getMonth() + 1 },
    };
    axios
      .request(options)
      .then((response) => {
        setBugs(response.data.north);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchFishData = () => {
    const options = {
      method: "GET",
      url: "http://localhost:8000/monthly-fish",
      params: { month: date.getMonth() + 1 },
    };

    axios
      .request(options)
      .then((response) => {
        setFish(response.data.north);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchSeaCreatureData = () => {
    const options = {
      method: "GET",
      url: "http://localhost:8000/monthly-sea-creatures",
      params: { month: date.getMonth() + 1 },
    };

    axios
      .request(options)
      .then((response) => {
        setSeaCreatures(response.data.north);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    // if (bugs === []) {
    fetchBugData();
    fetchFishData();
    fetchSeaCreatureData();
    // }
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
            {fish.length > 0 ? (
              <DataTable columns={fishColumns} data={fish} />
            ) : (
              <span>No fish data found.</span>
            )}
          </TabPanel>
          <TabPanel>
            {seaCreatures.length > 0 ? (
              <DataTable columns={seaCreatureColumns} data={seaCreatures} />
            ) : (
              <span>No sea creature data found.</span>
            )}
          </TabPanel>
        </Tabs>
      </div>
      <div>
        Data is retrieved from{" "}
        <a href="https://api.nookipedia.com/">Nookipedia API</a>
      </div>
    </div>
  );
}

export default App;
