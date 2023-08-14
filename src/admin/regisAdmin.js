const pool = require("../../db/pool");
const { uuid } = require("uuidv4");
const common = require("../common/common");

const exec = async (req, res) => {
  let client = await pool.connect();
  await client.query("BEGIN");
  let responseData = {};
  try {
    let data = req.body;

    let sqlUser = `SELECT * FROM public.admin WHERE username = $1`;
    let paramUser = [data.username];
    let responseUser = await pool.query(sqlUser, paramUser);

    if (responseUser.rowCount > 0) {
      responseData.success = false;
      responseData.data = "user duplicate";
    } else {
      let user_uuid = uuid();
      let encryptPwd = await common.commonService.encrypted(data.password);
      let sql = `INSERT INTO public."admin"
        (admin_id, username, "password", admin, create_date, "role")
        VALUES($1, $2, $3, $4, now(),'admin');
      `;
      let param = [user_uuid, data.username, encryptPwd, data.employee_id];
      let response = await pool.query(sql, param);
      responseData.success = true;
      client.query("COMMIT");
    }
  } catch (error) {
    console.log(error);
    client.query("ROLLBACK");
    responseData.success = false;
  } finally {
    client.release();
  }

  res.status(200).send(responseData);
  return res.end();
};

module.exports = exec;
