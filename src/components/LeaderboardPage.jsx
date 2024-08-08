import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // console.log("before useeffect");
  useEffect(() => {
    // console.log("before axios within useeffect");
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

  if (error) {
    return <div>Error during fetching the data: {error.message}</div>;
  }
  // Sort the leaderboard by wins in descending order
  const sortedLeaderboard = leaderboard.sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen text-center bg-base-100">
      <div className="m-auto my-4 align-middle"></div>
      {loading ? (
        <div>Loading the results...</div>
      ) : (
        <div>
          <h2 className="text-3xl py-4">High Score Table</h2>
          <table className="ml-[30rem] border-separate border-spacing-[32px] border-[5px] border-slate-200	table-fixed align-middle font-bold text-[1.5rem]">
            <thead>
              <tr>
                <th scope="col" className="border-separate">
                  Ranking
                </th>
                <th scope="col" className="border-separate">
                  Username
                </th>
                <th scope="col" className="border-separate">
                  Score
                </th>
                <th scope="col" className="border-separate">
                  Wins
                </th>
                <th scope="col" className="border-separate">
                  Losses
                </th>
                <th scope="col" className="border-separate">
                  First Ranked
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedLeaderboard.map(
                ({ _id, username, score, wins, losses, createdAt }, index) => {
                  const date = new Date(createdAt);
                  const firstRanked = `${String(date.getMonth() + 1).padStart(
                    2,
                    "0"
                  )}/${date.getFullYear()}`;
                  return (
                    <tr key={username}>
                      <td>{index + 1}</td>
                      <td className="text-left">
                        {username + " [" + _id + "]"}
                      </td>
                      <td>{score}</td>
                      <td>{wins}</td>
                      <td>{losses}</td>
                      <td>{firstRanked}</td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
