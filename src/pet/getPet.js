const pool = require("../../db/pool");

const exec = async (req, res) => {
  try {
    const searchPet = req.query.pet_owner;
    const searchByName = req.query.pet_name;
    let result;
    if (searchPet) {
      let sqlPet = `SELECT * FROM public.pet where pet_owner = $1`;
      let paramPet = [`${searchPet}`];
      result = await pool.query(sqlPet, paramPet);
    }
    if (searchByName) {
      let sqlPet = `SELECT u.fullname, p.pet_name, p.pet_id FROM public.pet p 
      JOIN public.user u ON u.user_id = p.pet_owner 
      WHERE pet_name ILIKE $1 `;
      let paramPet = [`%${searchByName}%`];
      result = await pool.query(sqlPet, paramPet);
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.log(error);
  }
};

module.exports = exec;
