import React, { useState, useEffect } from "react";

const Timeline = () => {
  // State to track table data and target date input
  const [activities, setActivities] = useState([
    {
      id: 1,
      date: "2024-03-07",
      start: "0800",
      end: "1200",
      activity: "Flight",
    },
    {
      id: 2,
      date: "2024-03-07",
      start: "1230",
      end: "1400",
      activity: "Ground",
    },
    {
      id: 3,
      date: "2024-03-08",
      start: "0900",
      end: "1100",
      activity: "Sim/ATD",
    },
  ]);
  const [targetDate, setTargetDate] = useState("2024-03-08");
  const [isLandscape, setIsLandscape] = useState(
    window.innerWidth > window.innerHeight
  );

  // Detect orientation changes (fixes iPhone rotation issue)
  useEffect(() => {
    const updateOrientation = () => {
      setIsLandscape(window.matchMedia("(orientation: landscape)").matches);
    };

    window.addEventListener("resize", updateOrientation);
    window
      .matchMedia("(orientation: landscape)")
      .addEventListener("change", updateOrientation);

    return () => {
      window.removeEventListener("resize", updateOrientation);
      window
        .matchMedia("(orientation: landscape)")
        .removeEventListener("change", updateOrientation);
    };
  }, []);

  // Function to update table values
  const handleEdit = (id, field, value) => {
    const updatedActivities = activities.map((activity) =>
      activity.id === id ? { ...activity, [field]: value } : activity
    );
    setActivities(updatedActivities);
  };

  // Function to convert time (HHMM) to a position on the timeline
  const timeToX = (time, isTargetDate) => {
    if (!time || time.length !== 4) return 0;
    const hours = parseInt(time.substring(0, 2), 10);
    const minutes = parseInt(time.substring(2, 4), 10);
    const totalMinutes = hours * 60 + minutes;

    const timelineWidth = window.innerWidth - 20; // Full width minus a little buffer
    const baseX = isTargetDate ? timelineWidth / 2 : 0;
    return baseX + (totalMinutes / 1440) * (timelineWidth / 2);
  };

  // Function to get color based on activity type
  const getActivityColor = (activity) => {
    switch (activity) {
      case "Flight":
        return "blue";
      case "Ground":
        return "brown";
      case "Sim/ATD":
        return "green";
      case "Pre/Post":
        return "purple";
      default:
        return "gray";
    }
  };

  return (
    <div className="flex flex-col items-center w-screen h-screen">
      {/* Timeline */}
      <svg
        width="100%"
        height="150"
        viewBox={`0 0 ${window.innerWidth} 150`}
        className="mt-16"
      >
        {/* Timeline line */}
        <line
          x1="0"
          y1="100"
          x2={window.innerWidth}
          y2="100"
          stroke="black"
          strokeWidth="3"
        />

        {/* Past Day Labels (First Half) */}
        {Array.from({ length: 13 }).map((_, i) => {
          const x = i * (window.innerWidth / 24);
          const label = (i * 2).toString().padStart(2, "0");

          return (
            <g key={i}>
              <text x={x} y="80" fontSize="14" textAnchor="middle">
                {label}
              </text>
              <line
                x1={x}
                y1="90"
                x2={x}
                y2="110"
                stroke="black"
                strokeWidth="2"
              />
            </g>
          );
        })}

        {/* Target Date Labels (Second Half) */}
        {Array.from({ length: 13 }).map((_, i) => {
          const x = window.innerWidth / 2 + i * (window.innerWidth / 24);
          const label = (i * 2).toString().padStart(2, "0");

          return (
            <g key={`target-${i}`}>
              <text x={x} y="80" fontSize="14" textAnchor="middle">
                {label}
              </text>
              <line
                x1={x}
                y1="90"
                x2={x}
                y2="110"
                stroke="black"
                strokeWidth="2"
              />
            </g>
          );
        })}

        {/* Labels for Past Day and Target Date */}
        <text
          x={window.innerWidth / 4}
          y="130"
          fontSize="16"
          textAnchor="middle"
        >
          Past Day
        </text>
        <text
          x={(window.innerWidth / 4) * 3}
          y="130"
          fontSize="16"
          textAnchor="middle"
        >
          Target Date
        </text>

        {/* Activity boxes correctly placed based on Target Date */}
        {activities.map((act) => {
          const isTargetDate = act.date === targetDate;
          if (!isTargetDate && new Date(act.date) >= new Date(targetDate))
            return null; // Ignore future dates

          const xStart = timeToX(act.start, isTargetDate);
          const xEnd = timeToX(act.end, isTargetDate);
          return (
            <rect
              key={act.id}
              x={xStart}
              y="40"
              width={Math.max(xEnd - xStart, 5)}
              height="20"
              fill={getActivityColor(act.activity)}
              stroke="black"
            />
          );
        })}
      </svg>

      {/* Target Date Input Field */}
      <div className="mt-6 w-1/4 text-center">
        <label className="block text-lg font-semibold mb-2">Target Date</label>
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="w-full border border-gray-400 p-2 text-center"
        />
      </div>

      {/* Editable Table */}
      <div className="mt-6 w-full flex justify-center">
        <table className="border-collapse border border-gray-400 w-3/4 text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 p-2">Date</th>
              <th className="border border-gray-400 p-2">Start</th>
              <th className="border border-gray-400 p-2">End</th>
              <th className="border border-gray-400 p-2">Activity</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td className="border border-gray-400 p-2">
                  <input
                    type="date"
                    value={activity.date}
                    onChange={(e) =>
                      handleEdit(activity.id, "date", e.target.value)
                    }
                    className="w-full text-center"
                  />
                </td>
                <td className="border border-gray-400 p-2">
                  <input
                    type="text"
                    value={activity.start}
                    onChange={(e) =>
                      handleEdit(activity.id, "start", e.target.value)
                    }
                    className="w-full text-center"
                  />
                </td>
                <td className="border border-gray-400 p-2">
                  <input
                    type="text"
                    value={activity.end}
                    onChange={(e) =>
                      handleEdit(activity.id, "end", e.target.value)
                    }
                    className="w-full text-center"
                  />
                </td>
                <td className="border border-gray-400 p-2">
                  <select
                    value={activity.activity}
                    onChange={(e) =>
                      handleEdit(activity.id, "activity", e.target.value)
                    }
                    className="w-full text-center"
                  >
                    <option value="Flight">Flight</option>
                    <option value="Ground">Ground</option>
                    <option value="Sim/ATD">Sim/ATD</option>
                    <option value="Pre/Post">Pre/Post</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timeline;
