const pool = require("../../db/pool");

const exec = async (req, res) => {
  try {
    const searchJob = req.query.jobtitle;
    const searchEmploy = req.query.employee_id;
    let sqlEmployeeID = [];
    let paramEmploy = [];

    if (searchEmploy) {
      sqlEmployeeID = `SELECT employee_id,e_name,jobtitle FROM public.employee WHERE employee_id ILIKE $1`;
      paramEmploy = [`${searchEmploy}%`];
    }
    if (searchJob) {
      sqlEmployeeID = `SELECT employee_id,e_name,jobtitle FROM public.employee WHERE jobtitle ILIKE $1`;
      paramEmploy = [`${searchJob}%`];
    }

    let result = await pool.query(sqlEmployeeID, paramEmploy);

    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = exec;
