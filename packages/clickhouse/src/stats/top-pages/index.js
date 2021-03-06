const { getDateRange } = require("../fragments");

const fetchTopPages = (ch) => async (dateRange, domain, websiteSettings) => {
  const { chDbName, timezone } = websiteSettings;
  const sql = `SELECT path, COUNT(*) AS total FROM ${chDbName}.events WHERE ${getDateRange(
    dateRange,
    timezone
  )} AND domain = '${domain}' GROUP BY path ORDER BY total DESC`;
  const stream = ch.query(sql);

  return new Promise((resolve, reject) => {
    const result = {};
    stream.on("error", (error) => reject(error));

    stream.on("data", (row) => {
      // row: [path, total]
      result[row[0]] = row[1] * 1;
    });

    stream.on("end", () => {
      resolve(result);
    });
  });
};

module.exports = {
  fetchTopPages,
};
