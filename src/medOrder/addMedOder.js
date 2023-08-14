const pool = require("../../db/pool");
const common = require("../common/common");

const exec = async (req, res) => {
  const client = await pool.connect();
  await client.query("BEGIN");
  let responseData = {};
  let tokenObj = {
    id: req._user.id,
    username: req._user.username,
    role: req._user.role,
  };

  try {
    let data = req.body;

    let sql = `INSERT INTO public.med_order
      (create_date, create_by, med_order, quantity, req_date)
      VALUES(now(), $1, $2, $3, $4);
    `;

    let param = [
      tokenObj.id,
      JSON.stringify(data.med_order),
      data.quantity,
      data.req_date,
    ];

    await pool.query(sql, param);

    responseData.success = true;
    client.query("COMMIT");
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
