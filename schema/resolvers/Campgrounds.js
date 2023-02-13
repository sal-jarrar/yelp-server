import pool from "../../config/db.js";
export const Campground = {
  reviews: async ({ camp_id }) => {
    const [rows] = await pool.query(
      `SELECT *  FROM review WHERE camp_id='${camp_id}'`
    );
    console.log(rows);
    if (rows.length) {
      return rows.map(async (row) => {
        const [user] = await pool.query(
          `SELECT * FROM users WHERE user_id='${row.user_id}'`
        );
        return { ...row, user: user[0] };
      });
    } else {
      return [];
    }
  },
};
