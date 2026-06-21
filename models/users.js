const pool = require('../configs/db');

const create = async (body)=>{
    let data = [body.name,body.email,body.password];
    let [result] = await pool.query('insert into users(name,email,password) values (?,?,?)',data);
    console.log(123);
    
}

module.exports = {
    create

};