import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("before useeffect");
  useEffect(() => {
    console.log("before axios within useeffect");
    axios
      .get(`http://localhost:8000/leaderboard`)
      .then((res) => {
        console.log(res.data);
        setLeaderboard(res.data);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Leaderboard</h1>
      <ul>
        {leaderboard.map(({ _id, username, score }) => (
          <li key={_id}>
            {username}: {score}
          </li>
        ))}
      </ul>
    </div>
  );
}
