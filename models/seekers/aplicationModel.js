const pool = require('../../configs/db');

// write form class

class applicationModel{
    async getAllSeeker(){
        let sql = 'SELECT u.name,u.avatar,sk.phone,sk.skill FROM tbl_users u INNER JOIN tbl_seekers sk ON u.id = sk.user_id';
        const [rows] = await pool.query(sql);
        if(rows.length === 0){
            throw new Error('Seeker not found');
        }
        return rows;
    }
    
    async getSeekerDetail(seekerId){
        let sql = 'SELECT u.name,u.avatar,sk.headline,sk.bio,sk.phone,sk.location,sk.skill FROM tbl_users u INNER JOIN tbl_seekers sk ON u.id = sk.user_id WHERE sk.user_id = ?';
        const [rows] = await pool.query(sql,[seekerId]);
        if(rows.length === 0){
            throw new Error('Seeker not found');
        }
        return rows[0];
    }

    async 
}

module.exports = new applicationModel();

