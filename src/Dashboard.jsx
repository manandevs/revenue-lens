import { useState, useEffect } from "react";
import "./styles/dashboard.scss";
import supabase from "./supabase-client";
import { BarChart } from "@mui/x-charts";

function Dashboard() {
  const [data, setData] = useState([]);

  async function fetchMetrics() {
    const { data, error } = await supabase
      .from("sales_deals")
      .select("name, value")
      .order("value", { ascending: false });

    if (error) {
      console.error("Error fetching deals:", error);
    } else {
      setData(data);
    }
  }

  useEffect(() => {
    fetchMetrics();
  }, []);

  // const aggregatedData = data.reduce((acc, curr) => {
  //   acc[curr.name] = (acc[curr.name] || 0) + curr.value
  //   return acc
  // }, {})
  // console.log(aggregatedData)

  // const names = Object.keys(aggregatedData)
  // const values = Object.values(aggregatedData)

  const names = data.map(item => item.name)
  const values = data.map(item => item.value)
  console.log(names, values)

  return (
    <div className="dashboard">
      <h1>RevenueLens Dashboard</h1>

      {/* Chart */}
      <h2>All Deals Chart</h2>
      <div className="chart">
        {data.length > 0 ? (
          <BarChart
            xAxis={[
              {
                id: 'names',
                data: names,
                scaleType: 'band',
                height: 28,
              },
            ]}
            series={[
              {
                data: values,
                label: 'Total Value',
              },
            ]}
            height={300}
          />
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;