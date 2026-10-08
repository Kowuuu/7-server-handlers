
const {pool}=require('./mysql');

async function getAllProducts(){
    const [rows]=await pool.query("SELECT * FROM products");
    return rows;
}
//proveri dal postoji u bazi ako ne vrati null, slug se uzima u arrayu[]
async function fetchSingleProduct(slug){
    const [rows]=await pool.query("SELECT * FROM products WHERE slug=? LIMIT 1",[slug]);
    return rows[0] || null;
}

module.exports={getAllProducts,fetchSingleProduct}