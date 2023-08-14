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

    let sqlOwner = `SELECT user_id , fullname FROM public.user WHERE fullname = $1`;
    let paramOwner = [data.owner];
    let responseOwner = await pool.query(sqlOwner, paramOwner);
    let ownerId = responseOwner.rows[0].user_id;

    let sqlPet = `SELECT * FROM public.pet WHERE pet_id = $1`;
    let paramDog = [data.pet_id];
    let responsePet = await pool.query(sqlPet, paramDog);

    let sql = `INSERT INTO public.pet
      (pet_id, pet_name, species, breed, weight, sterilizition, gender, pet_owner)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8);
      ;`;
    let param = [
      data.pet_id,
      data.pet_name,
      data.species,
      data.breed,
      data.weight,
      data.sterilizition,
      data.gender,
      ownerId,
    ];
    let response = await pool.query(sql, param);
    responseData.success = true;
    client.query("COMMIT");
  } catch (error) {
    console.log(error);
    client.query("ROLLBACK");
    responseData.success = false;
  } finally {
    client.release();
  }
  responseData._token = await common.commonService.generateToken(tokenObj);
  res.status(200).send(responseData);
  return res.end();
};

module.exports = exec;
