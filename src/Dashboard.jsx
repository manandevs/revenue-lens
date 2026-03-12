import { useState, useEffect } from "react";
import "./styles/dashboard.scss";
import supabase from "./supabase-client";
import { BarChart } from "@mui/x-charts";
import Form from "./components/Form";

function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchMetrics() {
      const { data, error } = await supabase
        .from("sales_deals")
        .select("id, name, value")
        .order("value", { ascending: false });

      if (!isMounted) return;

      if (error) {
        console.error(error);
      } else {
        setData(data);
      }
    }

    fetchMetrics();

    const channel = supabase
      .channel("deals_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sales_deals",
        },
        (payload) => {
          console.log("Realtime change:", payload);

          fetchMetrics();
        }
      )
      .subscribe();

    // single cleanup
    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const aggregatedData = data.reduce((acc, curr) => {
    acc[curr.name] = (acc[curr.name] || 0) + curr.value;
    return acc;
  }, {})

  const names = Object.keys(aggregatedData)
  const values = Object.values(aggregatedData)
  // const names = data.map(item => item.name)
  // const values = data.map(item => item.value)

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
        <Form deals={data} />
      </div>
    </div>
  );
}

export default Dashboard;