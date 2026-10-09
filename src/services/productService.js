
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
async function getProductsById(productIds){
    //SELECT * FROM products WHERE id IN (productIds)
    const placeholders=productIds.map(()=>'?').join(',') ;     //prodji preko svih productId i mapiraj
    // tako da svaki od njih ima upitnik i stavi zarez ismedju  [0,1,2]=>"?, ?, ?"
    const [rows]= await pool.query("SELECT * FROM products WHERE id IN (${placeholders})",productIds);
    return rows;
}

module.exports={getAllProducts,fetchSingleProduct,getProductsById}