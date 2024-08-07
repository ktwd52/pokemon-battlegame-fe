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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  // Sort the leaderboard by wins in descending order
  const sortedLeaderboard = leaderboard.sort((a, b) => b.wins - a.wins);

  return (
    <div className="min-h-screen text-center bg-base-100">
      <div className="m-auto my-4 align-middle"></div>
      {loading ? (
        <div>{/* <LoadingSpinner /> */}</div>
      ) : (
        <div>
          <table className="ml-[30rem] border-separate border-spacing-[32px] md: border-spacing-[24px] xs:border-spacing-[12px] border-[5px] border-slate-200	table-fixed align-middle font-bold text-[1.5rem]">
            <thead>
              <tr>
                <th scope="col" className="border-separate">
                  Ranking
                </th>
                <th scope="col" className="border-separate">
                  Username
                </th>
                <th scope="col" className="border-separate">
                  Wins
                </th>
                <th scope="col" className="border-separate">
                  Losses
                </th>
                <th scope="col" className="border-separate">
                  Ranked since
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedLeaderboard.map(
                ({ _id, username, wins, losses, createdAt }, index) => {
                  const date = new Date(createdAt);
                  const mmyyyyDate = `${String(date.getMonth() + 1).padStart(
                    2,
                    "0"
                  )}/${date.getFullYear()}`;
                  return (
                    <tr key={username}>
                      <td>{index + 1}</td>
                      <td className="text-left">
                        {username + " (" + _id + ")"}
                      </td>
                      <td>{wins}</td>
                      <td>{losses}</td>
                      <td>{mmyyyyDate}</td>
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
