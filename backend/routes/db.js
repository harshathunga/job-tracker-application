import mysql2 from "mysql2"

const db = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "Tharipriya21@",
    database: "jobtracker",
    
})

db.connect((err)=> {
    if(err){
        console.log(err)
    }else{
        console.log('connected')
    } 
})


export default db;