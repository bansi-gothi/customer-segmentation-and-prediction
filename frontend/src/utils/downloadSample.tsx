export const downloadSampleCSV = () => {
  const csvContent = `CustomerID,Date,Revenue,Transactions
CUST001,2026-02-20,5000,25
CUST002,2026-02-18,12000,10
CUST003,2026-02-10,3000,30
CUST004,2026-02-22,8000,15
CUST005,2026-02-23,15000,8
CUST006,2026-02-19,6000,20
CUST007,2026-02-21,9500,12
CUST008,2026-02-17,4000,18
CUST009,2026-02-20,11000,9
CUST010,2026-02-22,7000,14
CUST011,2026-01-28,2500,5
CUST012,2026-01-15,18000,4
CUST013,2026-02-01,2200,6
CUST014,2026-01-10,3200,7
CUST015,2026-02-05,8700,11`;

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "sample_customer_analytics_data.csv");
  link.click();
};
