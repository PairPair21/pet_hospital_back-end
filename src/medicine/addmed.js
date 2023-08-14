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

    if (responseData.rowCount > 0) {
      responseData.success = false;
      responseData.data = "Error Medicine ID";
    } else {
      let sql = `INSERT INTO public.medicine
      (medicine_name, volumn, "type", price, manufacturer)
      VALUES($1, $2, $3, $4, $5);`;
      let param = [
        data.medicine_name,
        data.volumn,
        data.type,
        data.price,
        data.manufacturer,
      ];
      let response = await pool.query(sql, param);
      responseData.success = true;
      client.query("COMMIT");
    }
  } catch (error) {
    console.log(error);
    client.query("ROLLBACK");
    responseData.success = false;
    responseData.data = "Important Data not Found";
  } finally {
    client.release();
  }
  responseData._token = await common.commonService.generateToken(tokenObj);
  res.status(200).send(responseData);
  return res.end();
};

module.exports = exec;
