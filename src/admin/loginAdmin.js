const pool = require("../../db/pool");
const common = require("../common/common");

const exec = async (req, res) => {
  let client = await pool.connect();
  let responseData = {};

  try {
    let data = req.body;

    let sql = `SELECT a.admin_id, a.username, a.password, e.e_name,a.role FROM admin a
    JOIN employee e ON a.admin = e.employee_id
    WHERE a.username = $1`;
    let param = [data.username];
    let responseUser = await pool.query(sql, param);

    if (responseUser.rowCount < 1) {
      responseData.success = false;
      responseData.data = "user not found";
    } else if (!responseUser.rowCount < 1) {
      let decryptedPwd = await common.commonService.decrypted(
        responseUser.rows[0].password
      );

      if (decryptedPwd == data.password) {
        let tokenObj = {
          id: responseUser.rows[0].admin_id,
          username: data.username,
          role: responseUser.rows[0].role,
        };

        responseData.success = true;
        responseData.data = responseUser.rows.map((i) => ({
          id: i.admin_id,
          admin_name: i.e_name,
          username: i.username,
          role: i.role,
        }));
        responseData._token = await common.commonService.generateToken(
          tokenObj
        );
      } else {
        responseData.success = false;
        responseData.data = "password invalid";
      }
    }
  } catch (error) {
    console.log(error);
    responseData.success = false;
  } finally {
    client.release();
  }
  res.status(200).send(responseData);
  return res.end();
};

module.exports = exec;
