const pool = require('../configs/db');


const findByEmail = async()=>{
    let sql = "select * from tbl_users where email = ?";
    let [row] = await pool.query(sql,email);
    return row;
}
const findById = async(id)=>{
    const [row] = await pool.query('SELECT name,email,password,role,token from users where id = ?',[id]);
    return row;
}

const register = async(body)=>{
    let sql = "INSERT INTO tbl_users(name,email,password,verification_token,verification_expires) values (?,?,?,?,?)";
    let data = [body.name,body.email,body.password,body.verificationToken,body.verificationExpired]; 
    let [result] = await pool.query(sql,data);
    
    return result.insertId;
}

module.exports = {
    register,
    findByEmail,
    findById
}