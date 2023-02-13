import { UserInputError } from "apollo-server";
import pool from "../../config/db.js";
import checkAuth, { generateToken } from "../../util/check-auth.js";
import bcrypt from "bcryptjs";

export default {
  createCampground: async (_, { input }, context) => {
    console.log(context);
    const user = checkAuth(context);
    console.log(user, "from auth");
    try {
      const {
        title,
        location,
        image,
        price,
        description,
        created_at,
        user_id,
      } = input;
      const [{ insertId }] = await pool.query(
        `INSERT INTO campground(title,location,image,price,description,created_at,user_id) VALUES ('${title}','${location}','${image}','${price}','${description}','${created_at}','${user_id}');`
      );

      const [rows] = await pool.query(
        `SELECT * FROM campground WHERE camp_id=${insertId}`
      );
      console.log(rows);
      const [userSql] = await pool.query(
        `SELECT * FROM users WHERE user_id='${rows[0].user_id}'`
      );
      console.log(userSql, "user from sql");

      return { ...rows[0], user: userSql[0] };
    } catch (error) {
      console.log(error);
    }
  },
  updateCampground: async (_, { input }, context) => {
    console.log(context);
    const user = checkAuth(context);
    console.log(user, "from auth");
    try {
      const { title, location, image, price, description, user_id, camp_id } =
        input;

      const [row] = await pool.query(
        `UPDATE campground SET title='${title}',location='${location}',image='${image}',price='${price}',description='${description}',user_id='${user_id}' WHERE camp_id='${camp_id}'`
      );

      const [rows] = await pool.query(
        `SELECT * FROM campground WHERE camp_id=${camp_id}`
      );
      console.log(rows);
      const [userSql] = await pool.query(
        `SELECT * FROM users WHERE user_id='${rows[0].user_id}'`
      );
      console.log(userSql, "user from sql");

      return { ...rows[0], user: userSql[0] };
    } catch (error) {
      console.log(error);
    }
  },

  deleteCampground: async (_, { campId }) => {
    await pool.query(`DELETE FROM review WHERE camp_id='${campId}'`);
    await pool.query(`DELETE FROM campground WHERE camp_id='${campId}'`);

    return "CAMPGROUND DELETED!";
  },
  registerUser: async (_, { input }) => {
    const { name, email, password } = input;
    const [res] = await pool.query(
      `SELECT * FROM users WHERE email='${email}'`
    );
    console.log(res[0]);
    const foundEmail = res[0]?.email;

    if (foundEmail) throw new Error("Dublicate email");
    // hash password and create an auth token
    const hashPassword = await bcrypt.hash(password, 12);
    const [{ insertId }] = await pool.query(
      `INSERT INTO users(name,email,password) VALUES ('${name}','${email}','${hashPassword}');`
    );

    const [rows] = await pool.query(
      `SELECT * FROM users WHERE user_id=${insertId}`
    );
    const token = generateToken(rows[0]);

    return { ...rows[0], token };
  },
  loginUser: async (_, { input }) => {
    const { email, password } = input;
    console.log(email, "e");
    const [res] = await pool.query(
      `SELECT * FROM users WHERE email='${email}'`
    );

    console.log(res[0], "res");

    const foundEmail = res[0]?.email;
    const userPass = res[0]?.password;

    if (!foundEmail) throw new Error("Check email or Password");

    const match = await bcrypt.compare(password, userPass);

    if (!match) {
      throw new UserInputError("Wrong crendetials", {
        errors: { general: "Wrong crendetials" },
      });
    }
    const token = generateToken(res[0]);

    return { ...res[0], token };
  },
  addReview: async (_, { input }) => {
    const { camp_id, user_id, comment, created_at, rating } = input;

    const [{ insertId }] = await pool.query(
      `INSERT INTO review (camp_id,user_id,comment,created_at,rating)VALUES('${camp_id}','${user_id}','${comment}','${created_at}','${rating}')`
    );
    const [review] = await pool.query(
      `SELECT * FROM review WHERE review_id='${insertId}'`
    );

    const [user] = await pool.query(
      `SELECT * FROM users WHERE user_id=${review[0].user_id}`
    );

    return { ...review[0], user: user[0] };
  },
  updateReview: async (_, { input }) => {
    console.log("start");
    const { comment, review_id, rating } = input;

    await pool.query(
      `UPDATE review SET comment='${comment}',rating='${rating}' WHERE review_id='${review_id}'`
    );
    const [review] = await pool.query(
      `SELECT * FROM review WHERE review_id='${review_id}'`
    );

    const [user] = await pool.query(
      `SELECT * FROM users WHERE user_id=${review[0].user_id}`
    );

    return { ...review[0], user: user[0] };
  },

  deleteReview: async (_, { reviewId }) => {
    await pool.query(`DELETE FROM review WHERE review_id='${reviewId}'`);

    return " REVEIW DELETED!";
  },
};
