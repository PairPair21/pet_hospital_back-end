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
    let sql = `INSERT INTO public."case"
    (date_start, date_end, findings, complains, cashier, price, vet_id, pet_id, create_by, create_date, follow, weight, order_med_id)
    VALUES($1, $2, $3, $4, $5, $6 , $7, $8, $9, now(), $10, $11, $12);
    `;

    let param = [
      data.date_start,
      data.date_end,
      data.findings,
      data.complains,
      data.cashier,
      data.price,
      data.vet_id,
      data.pet_id,
      req._user.id,
      data.follow,
      data.weight,
      data.order_med_id,
    ];
    let response = await pool.query(sql, param);
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
