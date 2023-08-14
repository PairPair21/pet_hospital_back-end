const pool = require("../../db/pool");

const exec = async (req, res) => {
  let searchCase = req.query.pet_id;
  let sqlCase = `SELECT c.case_id, c.date_start,e.e_name, m.med_order, c.date_end, c.findings, c.complains, c.price, e.e_name, p.pet_name, c.follow, c.weight FROM public.case c
  JOIN public.employee e ON e.employee_id = c.vet_id
  JOIN public.pet p ON p.pet_id = c.pet_id
  JOIN public.med_order m ON m.order_id = c.order_med_id
  WHERE c.pet_id = $1;
  `;
  let paramCase = [`${searchCase}`];
  let result = await pool.query(sqlCase, paramCase);
  res.status(200).json(result.rows);
  try {
  } catch (error) {
    console.log(error);
  }
};

module.exports = exec;
