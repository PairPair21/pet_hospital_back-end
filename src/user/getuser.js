const pool = require("../../db/pool");

const exec = async (req, res) => {
  try {
    const searchName = req.query.fullname;
    let sqlUser = `SELECT username, fullname FROM public.user Where fullname ILIKE $1`;
    let paramUser = [`%${searchName}%`];

    let result = await pool.query(sqlUser, paramUser);
    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = exec;
