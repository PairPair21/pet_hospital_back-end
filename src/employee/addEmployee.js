const pool = require("../../db/pool");
const common = require("../common/common");

const exec = async (req, res) => {
  let client = await pool.connect();
  await client.query("BEGIN");
  let responseData = {};
  let tokenObj = {
    id: req._user.id,
    username: req._user.username,
    role: req._user.role,
  };

  try {
    let data = req.body;
    let sqlEmployee = `SELECT * FROM public.employee where employee_id = $1`;
    let paramEmploy = [data.employee_id];
    let reponseEmploy = await pool.query(sqlEmployee, paramEmploy);

    if (reponseEmploy.rowCount > 0) {
      responseData.success = false;
      responseData.data = "Employee ID duplicate";
    } else {
      let sql = `INSERT INTO public.employee
        (employee_id, e_name, e_phone, e_email, e_address, jobtitle, status,license)
        VALUES($1, $2, $3, $4, $5, $6, $7,$8);
        `;
      let param = [
        data.employee_id,
        data.e_name,
        data.e_phone,
        data.e_email,
        data.e_address,
        data.jobtitle,
        data.status,
        data.license,
      ];
      let response = await pool.query(sql, param);
      responseData.success = true;
      client.query("COMMIT");
    }
  } catch (error) {
    console.log(error);
    client.query("ROLLBACK");
    responseData.success = false;
    responseData.data = "Add Data Error";
  } finally {
    client.release();
  }
  responseData._token = await common.commonService.generateToken(tokenObj);
  res.status(200).send(responseData);
  return res.end();
};

module.exports = exec;
