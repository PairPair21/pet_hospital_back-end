const pool = require("../../db/pool");
const common = require("../common/common");

const exec = async (req, res) => {
  let client = await pool.connect();
  let responseData = {};

  try {
    let data = req.body;

    let sql = `SELECT * FROM public.user WHERE username = $1`;
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
          id: responseUser.rows[0].user_id,
          username: data.username,
          role: responseUser.rows[0].role,
        };
        responseData.success = true;
        responseData.data = responseUser.rows.map((i) => ({
          id: i.user_id,
          fullname: i.fullname,
          phone: i.phone,
          email: i.email,
          username: i.username,
          address: i.address,
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
