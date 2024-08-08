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
        <div className="relative table-fixed">
          <h2 className="text-3xl py-4">High Score Table</h2>
          <table className="text-center w-auto text-m text-gray-500 dark:text-gray-400 m-auto border-separate border-spacing-[12px] border-[8px] border-slate-200	 align-middle font-bold text-[1.5rem]">
            <thead className="uppercase dark:bg-gray-700 dark:text-gray-400 bg-[#1c4e80] border-b sticky top-0 text-[#cfdae6] align-middle">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Ranking
                </th>
                <th scope="col" className="px-6 py-3">
                  [Id]
                </th>
                <th scope="col" className="px-6 py-3">
                  Username
                </th>
                <th scope="col" className="px-6 py-3">
                  Playing since
                </th>
                <th scope="col" className="px-6 py-3">
                  Score
                </th>
                <th scope="col" className="px-6 py-3">
                  Wins
                </th>
                <th scope="col" className="px-6 py-3">
                  Losses
                </th>
                <th scope="col" className="px-6 py-3">
                  Last game played
                </th>
              </tr>
            </thead>
            <tbody className="align-middle">
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
                    <tr
                      key={username}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white "
                      >
                        {index + 1}
                      </th>
                      <td scope="row">[{_id}]</td>
                      <td scope="row">{username}</td>
                      <td scope="row" className="px-6 py-4">
                        {playingSince}
                      </td>
                      <td scope="row" className="px-6 py-4">
                        {score}
                      </td>
                      <td scope="row" className="px-6 py-4">
                        {wins}
                      </td>
                      <td scope="row" className="px-6 py-4">
                        {losses}
                      </td>
                      <td scope="row" className="px-6 py-4">
                        {" "}
                        {new Date(updatedAt).toLocaleDateString("us-US")}
                      </td>
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
