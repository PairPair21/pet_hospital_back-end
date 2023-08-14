const pool = require("../../db/pool");

const exec = async (req, res) => {
  let tokenObj = {
    id: req._user.id,
    username: req._user.username,
    role: req._user.role,
  };
  try {
    let sql = `SELECT order_id,create_date,med_order FROM public.med_order WHERE create_by ILIKE $1 order by create_date desc`;
    let param = [req._user.id];

    let response = await pool.query(sql, param);
    res.status(200).json(response.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = exec;
