import pool from "../../config/db.js";
export const Query = {
  getCapmgrounds: async () => {
    const [rows] = await pool.query("SELECT * FROM campground");

    const camps = rows.map(async (row) => {
      const [rating] = await pool.query(
        `SELECT AVG(rating) as raitng FROM review WHERE camp_id='${row.camp_id}'`
      );
      const [user] = await pool.query(
        `SELECT * FROM users WHERE user_id='${rows[0].user_id}'`
      );
      // console.log(user);
      return { ...row, rating: Number(rating[0].raitng), user: user[0] };
    });

    return camps;
  },
  campground: async (_, { campId }) => {
    const [rows, fields] = await pool.query(
      `SELECT * FROM campground WHERE camp_id=${campId}`
    );
    console.log(rows);
    const [rating] = await pool.query(
      `SELECT AVG(rating) as raitng FROM review WHERE camp_id='${campId}'`
    );
    const [user] = await pool.query(
      `SELECT * FROM users WHERE user_id='${rows[0].user_id}'`
    );
    const res = { ...rows[0], rating: Number(rating[0].raitng), user: user[0] };
    console.log(res);
    return res;
  },
};
