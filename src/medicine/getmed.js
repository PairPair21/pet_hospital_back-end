const pool = require("../../db/pool");

const exec = async (req, res) => {
  try {
    const searchName = req.query.medicine_name;
    let result;

    if (searchName) {
      sql = `SELECT * FROM public.medicine WHERE medicine_name ILIKE $1`;
      param = [`%${searchName}%`];

      let result = await pool.query(sql, param);
      res.status(200).json(result.rows);
    } else {
      let sql = `SELECT * FROM public.medicine `;
      result = await pool.query(sql);
      res.status(200).json(result.rows);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = exec;
