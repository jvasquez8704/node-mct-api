const { response } = require('express');
const { pool } = require('../database/connect');
const ENTITY_ID = 2; 



const getScoringRule = async (req, res = response) => {
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

const getScoringRule2Cats = async (req, res = response) => {
    const { catId, scatId } = req.params;
    
    res.json({
        ok: true,
        data: 'In dev GET/ScoringRule by 2 categories... :D'
    });
}

const getScoringRuleCat = async (req, res = response) => {
    const { catId } = req.params;
    
    res.json({
        ok: true,
        data: 'In dev GET/ScoringRule by category... :D'
    });
}

const createScoringRule = async (req, res = response) => {

    console.log(req.body.html_encoded_text);
    const query = 'INSERT INTO info_block("content", is_active, created_at, updated_at, entity_id) VALUES($1, $2, $3, $4, $5)';
    const values = [req.body.html_encoded_text, 'true', 'now()', null, 1];
    
    try {
        const resulset = await pool.query(query, values);
        console.log('Resultado ', resulset);
        res.status(201).json({
            ok: true,
            values
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            payload: 'Comunicate con el administradors',
        });
    }
};

module.exports = {
    getScoringRule,
    getScoringRule2Cats,
    createScoringRule,
    getScoringRuleCat
}