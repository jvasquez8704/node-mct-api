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

const createGeneDoc = async (req, res = response) => {
    console.log('create Gene Doc => ', req.body);
    const { title, subtitle, document_name, summary, description, long_description, version, html_encoded_info, subsubcategory_id} = req.body;

    //Manual validation
    const resulset = await pool.query('SELECT * FROM media_category WHERE category_id = $1', [subsubcategory_id]);
    if (resulset.rowCount) {
        return res.status(400).json({
            ok: false,
            mjs: 'This gene already exists check it!'
        });
    }

    const query = 'INSERT INTO gene(title, subtitle, document_name, summary, description, long_description, is_active, archived, created_at, last_update_date, "version", type_id, created_by, last_updated_by) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *';
    const _query = 'INSERT INTO media_category (title, description, is_active, created_at, updated_at, media_id, category_id, doc_id, score_rule_id, gene_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
    const subquery = 'INSERT INTO info_block("content", is_active, created_at, updated_at, genome_id, entity_type) VALUES($1, $2, $3, $4, $5, $6)';
    const values = [title, subtitle, document_name, summary, description, long_description, 'true', 'true', 'now()', null, version, null, 1, null];
    
    try {
        const resulsetInsertGene = await pool.query(query, values);
        const { id:gene_id } = resulsetInsertGene.rows[0];
        const _values = ['', '', 'true', 'now()', null, null, subsubcategory_id, null, null, gene_id];
        const resulsetInsertGenome = await pool.query(_query, _values);
        const { id:genome_id } = resulsetInsertGenome.rows[0];
        console.log('Inserted Gene:', resulsetInsertGene.rows[0]);
        if(html_encoded_info.length > 0) {
            html_encoded_info.map( async item => {
                const { html_encoded_text } = item;
                const sqValues = [html_encoded_text, 'true', 'now()', null, genome_id, 1];//entity_type, 1=gene, 2=scoring_rule
                await pool.query(subquery, sqValues);
            });
        }
        res.status(201).json({
            ok: true,
            values
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            payload: 'Comunicate with system administradors',
        });
    }
};

module.exports = {
    getGenes,
    getGeneCats,
    getCats,
    getGene2Cats,
    getGeneCat,
    createGeneDoc
}