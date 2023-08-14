const pool = require("../../db/pool");

const exec = async (req, res) => {
  let client = await pool.connect();
  await client.query("BEGIN");
  let responseData = {};

  try {
    let data = req.body;
    let sqlVac = `SELECT * FROM public.vaccine WHERE vaccine_id = $1`;
    let paramVac = [data.sqlVac];
    let responseVac = await pool.query(sqlVac, paramVac);

    if (responseVac.rowCount > 0) {
      responseData.success = false;
      responseData.data = "Error Generate Vaccine ID";
    } else {
      let sql = `INSERT INTO public.vaccine
            (vaccine_id, vaccine_name, manufacturer)
            VALUES($1, $2, $3);
            `;
      let param = [data.vaccine_id, data.vaccine_name, data.manufacturer];
      let response = await pool.query(sql, param);
      responseData.success = true;
      client.query("COMMIT");
    }
  } catch (error) {
    console.log(error);
    client.query("ROLLBACK");
    responseData.success = false;
    responseData.data = "Name already exists";
  } finally {
    client.release();
  }

  res.status(200).send(responseData);
  return res.end();
};

module.exports = exec;
