const pool = require("../../db/pool");
const { uuid } = require("uuidv4");
const common = require("../common/common");

const exec = async (req, res) => {
  let client = await pool.connect();
  await client.query("BEGIN");
  let responseData = {};
  try {
    let data = req.body;

    let sqlUser = `SELECT * FROM public.user WHERE username = $1`;
    let paramUser = [data.username];
    let responseUser = await pool.query(sqlUser, paramUser);

    if (responseUser.rowCount > 0) {
      responseData.success = false;
      responseData.data = "user duplicate";
    } else {
      let user_uuid = uuid();
      let encryptPwd = await common.commonService.encrypted(data.password);
      let sql = `INSERT INTO public."user"
      (user_id, fullname, username, "password", phone, email, address, "role", create_date, create_by)
      VALUES($1, $2, $3, $4, $5, $6, $7, 'user', now(), $8);
      `;
      let param = [
        user_uuid,
        data.fullname,
        data.username,
        encryptPwd,
        data.phone,
        data.email,
        data.address,
        user_uuid,
      ];
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
