const pool = require("../configs/db");

// find by email
const findByEmail = async (email) => {
  let sql = "select * from tbl_users where email = ?";
  let [row] = await pool.query(sql, [email]);
  return row;
};

// find by id
const findById = async (id) => {
  const [row] = await pool.query(
    "SELECT id, name,email,token from tbl_users where id = ?",
    [id],
  );
  return row;
};

// user register
const register = async (body) => {
  let sql =
    "INSERT INTO tbl_users(name,email,password,verification_token,verification_expired) values (?,?,?,?,?)";
  let data = [
    body.name,
    body.email,
    body.password,
    body.verificationToken,
    body.verificationExpired,
  ];
  let [result] = await pool.query(sql, data);
  return result.insertId;
};

// verify email
const verifyEmail = async (id) => {
  await pool.query("update tbl_users set is_verify = '1' where id = ?", [id]);
};

// findByVerificationToken 
const findByVerificationToken = async (token) => {
  
  let [row] = await pool.query(
    "select id,name,email,password,is_verify,verification_expired from tbl_users where verification_token = ?",
    [token],
  );
  return row;
};

// resend verificationEmail
const resendVerificationEmail = async(body)=>{
  let [rows] = await pool.query("UPDATE tbl_users set verification_token = ? , verification_expired = ? where id = ?",[body.verificationEmail , body.verificationExpired,body.id]);

}

// add token 
const addToken = async(token,id) =>{
  let [rows] = await pool.query('UPDATE tbl_users set token = ? where id = ?',[token,id]);
}

// delete token
const deleteToken = async(id)=>{
  await pool.query("UPDATE tbl_users token = '' where id = ? ",[id]);
}


module.exports = {
  register,
  findByEmail,
  findById,
  verifyEmail,
  findByVerificationToken,
  resendVerificationEmail,
  addToken,
  deleteToken
};
