const pool = require('../configs/db');

// find by email
const findByEmail = async(email)=>{
    let sql = "select * from tbl_users where email = ?";
    let [row] = await pool.query(sql,[email]);
    return row;
}

// find by id
const findById = async(id)=>{
    const [row] = await pool.query('SELECT name,email,token from tbl_users where id = ?',[id]);
    return row;
}

// user register
const register = async(body)=>{
    let sql = "INSERT INTO tbl_users(name,email,password,verification_token,verification_expired) values (?,?,?,?,?)";
    let data = [body.name,body.email,body.password,body.verificationToken,body.verificationExpired]; 
    let [result] = await pool.query(sql,data);
    return result.insertId;
    
}

const verifyEmail = async(id) =>{
    await pool.query('update tbl_user set is_verify = 1 where id = ?',[id]);
}

module.exports = {
    register,
    findByEmail,
    findById,
    verifyEmail
}