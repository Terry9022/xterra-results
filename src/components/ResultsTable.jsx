import { useState, useEffect, useMemo } from "react";
import { Award, Search } from "lucide-react";

// eslint-disable-next-line react/prop-types
const Alert = ({ children }) => (
  <div
    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
    role="alert"
  >
    <strong className="font-bold">Error!</strong>
    <span className="block sm:inline"> {children}</span>
  </div>
);

const ResultsTable = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [fastestTimes, setFastestTimes] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch(
        "https://core.xterraplanet.com/api/application-task/cee4389b-1668-4e39-b500-3572f0982b09"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }
      const data = await response.json();
      processResults(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const processResults = (data) => {
    // Filter out results with unrealistic total times
    const validResults = data.filter((result) => {
      const [hours, minutes, seconds] = result.total_time
        .split(":")
        .map(Number);
      return hours < 23 && minutes < 60 && seconds < 60;
    });

    // Sort results by total time
    const sortedResults = validResults.sort((a, b) => {
      return a.total_time.localeCompare(b.total_time);
    });

    // Find fastest split times
    const fastestSplits = {
      swim_time: { time: "23:59:59", athlete: "" },
      bike_time: { time: "23:59:59", athlete: "" },
      run_time: { time: "23:59:59", athlete: "" },
    };

    sortedResults.forEach((result) => {
      result.splits.forEach((split) => {
        if (["swim_time", "bike_time", "run_time"].includes(split.name)) {
          if (
            split.time !== "00:00:00" &&
            split.time !== "23:59:59" &&
            split.time < fastestSplits[split.name].time
          ) {
            fastestSplits[split.name] = {
              time: split.time,
              athlete: `${result.first_name} ${result.last_name}`,
            };
          }
        }
      });
    });

    setResults(sortedResults);
    setFastestTimes(fastestSplits);
  };

  const filterResults = useMemo(() => {
    return results.filter((result) => {
      return result.last_name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [results, searchTerm]);

  if (error) {
    return <Alert>{error}. Please try refreshing the page.</Alert>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Triathlon Results</h1>
      <div className="overflow-x-auto">
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600" />
        </div>
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Gender</th>
              <th className="px-4 py-2">Division</th>
              <th className="px-4 py-2">Nationality</th>
              <th className="px-4 py-2">Total Time</th>
              <th className="px-4 py-2">Fastest Splits</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Loading and sorting results, please wait...
                </td>
              </tr>
            ) : searchTerm.length === 0 ? (
              results.map((result, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{`${result.first_name} ${result.last_name}`}</td>
                  <td className="px-4 py-2">{result.gender}</td>
                  <td className="px-4 py-2">{result.division}</td>
                  <td className="px-4 py-2">{result.nationality}</td>
                  <td className="px-4 py-2">{result.total_time}</td>
                  <td className="px-4 py-2">
                    {fastestTimes.swim_time.athlete ===
                      `${result.first_name} ${result.last_name}` && (
                      <div className="flex items-center">
                        <Award className="inline-block mr-1 text-blue-500" />
                        <span className="text-blue-500">Fastest Swim</span>
                      </div>
                    )}
                    {fastestTimes.bike_time.athlete ===
                      `${result.first_name} ${result.last_name}` && (
                      <div className="flex items-center">
                        <Award className="inline-block mr-1 text-green-500" />
                        <span className="text-green-500">Fastest Bike</span>
                      </div>
                    )}
                    {fastestTimes.run_time.athlete ===
                      `${result.first_name} ${result.last_name}` && (
                      <div className="flex items-center">
                        <Award className="inline-block mr-1 text-red-500" />
                        <span className="text-red-500">Fastest Run</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              filterResults.map((result, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{`${result.first_name} ${result.last_name}`}</td>
                  <td className="px-4 py-2">{result.gender}</td>
                  <td className="px-4 py-2">{result.division}</td>
                  <td className="px-4 py-2">{result.nationality}</td>
                  <td className="px-4 py-2">{result.total_time}</td>
                  <td className="px-4 py-2">
                    {fastestTimes.swim_time.athlete ===
                      `${result.first_name} ${result.last_name}` && (
                      <div className="flex items-center">
                        <Award className="inline-block mr-1 text-blue-500" />
                        <span className="text-blue-500">Fastest Swim</span>
                      </div>
                    )}
                    {fastestTimes.bike_time.athlete ===
                      `${result.first_name} ${result.last_name}` && (
                      <div className="flex items-center">
                        <Award className="inline-block mr-1 text-green-500" />
                        <span className="text-green-500">Fastest Bike</span>
                      </div>
                    )}
                    {fastestTimes.run_time.athlete ===
                      `${result.first_name} ${result.last_name}` && (
                      <div className="flex items-center">
                        <Award className="inline-block mr-1 text-red-500" />
                        <span className="text-red-500">Fastest Run</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;
