const { response } = require('express');
const { pool } = require('../database/connect');


const getGenes =  async (req, res = response) => {
    const resulset = await pool.query('SELECT * FROM gene');
    const genes = resulset.rows;
    res.json({
        ok: true,
        data: genes
    });
};

const getCats =  async (req, res = response) => {
    const resulset = await pool.query('SELECT * FROM category');
    const cats = resulset.rows;
    const data = cats.filter( cat => {
        cat.children = cats.filter( subcat => cat.id === subcat.parent_id);
        return cat.parent_id === null;
    });
    res.json({
        ok: true,
        data: data
    });
};

const getGeneCats = async (req, res = response) => {
    const { catId, scatId, sscatId } = req.params;
    const query = 'select d.* from category as sscat left join category as scat on sscat.parent_id = scat.id left join media_category as mc on mc.category_id = sscat.id left join doc as d on mc.doc_id = d.id where sscat.id = $1 and scat.id = $2 and scat.parent_id = $3 and d.id is not null';
    const values = [sscatId, scatId, catId];

    const resultSet = await pool.query(query, values);
    if (!resultSet.rowCount) {
        return res.status(400).json({
            ok: false,
            mjs: 'This doc does not exist in DB'
        });
    }
    let doc = resultSet.rows[0];
    const resultSetInfo = await pool.query('SELECT * from info_chunk WHERE doc_id = $1', [doc.id]);

    if (resultSetInfo.rowCount) {
        doc.html_encoded_info = resultSetInfo.rows.map( row => ({'html_encoded_text':row.content}));
    }else{
        doc.html_encoded_info = []
    }
    
    res.json({
        ok: true,
        data: doc
    });
}


const getGene2Cats = async (req, res = response) => {
    const { catId, scatId } = req.params;
    
    res.json({
        ok: true,
        data: 'In dev GET/Gene by 2 categories... :D'
    });
}

const getGeneCat = async (req, res = response) => {
    const { catId } = req.params;
    
    res.json({
        ok: true,
        data: 'In dev GET/Gene by category... :D'
    });
}

module.exports = {
    getGenes,
    getGeneCats,
    getCats,
    getGene2Cats,
    getGeneCat
}