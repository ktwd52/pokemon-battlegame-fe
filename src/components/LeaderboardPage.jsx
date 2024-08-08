import React, { useEffect, useState } from "react";
import axios from "axios";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = `${import.meta.env.VITE_SERVER_URI}:${
      import.meta.env.VITE_SERVER_PORT
    }/leaderboard`;
    axios
      .get(url)
      .then((res) => {
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

  // Sort the leaderboard by score in descending order, then by createdAt in descending order
  const sortedLeaderboard = leaderboard.sort((a, b) => {
    if (b.score === a.score) {
      return b.wins - a.wins; // Sort by wins in descending order
    }
    return b.score - a.score; // Sort by score in descending order
  });

  return (
    <div className="min-h-screen text-center bg-base-100">
      <div className="m-auto my-4 align-middle"></div>
      {loading ? (
        <div>Loading the results...</div>
      ) : (
        <div>
          <h2 className="text-3xl py-4">High Score Table</h2>
          <table className="m-auto border-separate border-spacing-[32px] border-[5px] border-slate-200	table-fixed align-middle font-bold text-[1.5rem]">
            <thead className="bg-[#1c4e80] border-b sticky top-0 text-[#cfdae6]">
              <tr>
                <th scope="col" className="border-separate">
                  Ranking
                </th>
                <th scope="col" className="border-separate">
                  Username
                </th>
                <th scope="col" className="border-separate">
                  Playing since
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
                  Last game played
                </th>
              </tr>
            </thead>
            <tbody className="h-96 overflow-y-auto">
              {sortedLeaderboard.map(
                (
                  { _id, username, score, wins, losses, createdAt, updatedAt },
                  index
                ) => {
                  const date = new Date(createdAt);
                  const playingSince = `${date.getFullYear()}/${String(
                    date.getMonth() + 1
                  ).padStart(2, "0")}`;

                  return (
                    <tr key={username}>
                      <td>{index + 1}</td>
                      <td className="text-left">
                        {username + " - id[" + _id + "]"}
                      </td>
                      <td>{playingSince}</td>
                      <td>{score}</td>
                      <td>{wins}</td>
                      <td>{losses}</td>
                      <td>{new Date(updatedAt).toLocaleDateString("us-US")}</td>
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
