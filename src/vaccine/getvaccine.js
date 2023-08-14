const pool = require("../../db/pool");

const exec = async (req, res) => {
  try {
    let sql = `SELECT * FROM public.vaccine `;

    let response = await pool.query(sql);

    if (response.rowCount > 0) {
      res.status(200).json(response.rows);
    } else {
      const data = "0";
      res.status(200).json(data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = exec;
