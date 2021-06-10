const { response } = require('express');
const { pool } = require('../database/connect');


const getGenes =  async (req, res = response) => {
    const resulset = await pool.query('SELECT * FROM gene');
    const genes = resulset.rows;
    res.json({
        status: {
            code: 200,
            message: "Success",
        },
        data:genes
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
        status: {
            code: 200,
            message: "Success",
        },
        data: data
    });
};

const getGeneCats = async (req, res = response) => {
    const { catId, scatId, sscatId } = req.params;
    const query = 'select g.*, mc.id as genome_id from category as sscat left join category as scat on sscat.parent_id = scat.id left join media_category as mc on mc.category_id = sscat.id left join gene as g on mc.gene_id = g.id where sscat.id = $1 and scat.id = $2 and scat.parent_id = $3 and g.id is not null';
    const values = [sscatId, scatId, catId];

    const resultSet = await pool.query(query, values);
    if (!resultSet.rowCount) {
        return res.status(400).json({
            status: {
                code: 400,
                message: 'This gene does not exist in DB',
            },
            data: null
        });
    }
    let genome = resultSet.rows[0];
    genome.category_id = catId;
    genome.subcategory_id = scatId;
    genome.subsubcategory_id = sscatId;
    genome.created_by = "O8boEKCJjEMhVS9bbNjcpEunXaD2";
    genome.document_type = "sub_subcategory";
    const resultSetInfo = await pool.query('SELECT * from info_block WHERE genome_id = $1 and entity_type = 1', [genome.genome_id]);

    if (resultSetInfo.rowCount) {
        genome.html_encoded_info = resultSetInfo.rows.map( row => ({'html_encoded_text':row.content}));
    }else{
        genome.html_encoded_info = []
    }
    //clean response before sent it
    delete genome["id"];
    delete genome["name"];
    delete genome["genome_id"];
    delete genome["is_active"];
    delete genome["str_id"];
    delete genome["title"];
    delete genome["subtitle"];
    delete genome["type_id"];
    res.json({
        status: {
            code: 200,
            message: "Success",
        },
        data: genome
    });
}


const getGene2Cats = async (req, res = response) => {
    const { catId, scatId } = req.params;
    const query = 'select g.*, mc.id as genome_id from category as scat left join media_category as mc on mc.category_id = scat.id left join gene as g on mc.gene_id = g.id where scat.id = $1 and scat.parent_id = $2 and g.id is not null';
    const values = [scatId, catId];

    const resultSet = await pool.query(query, values);
    if (!resultSet.rowCount) {
        return res.status(400).json({
            status: {
                code: 400,
                message: 'This gene does not exist in DB',
            },
            data: null
        });
    }
    let genome = resultSet.rows[0];
    genome.category_id = catId;
    genome.subcategory_id = scatId;
    genome.subsubcategory_id = null;
    genome.created_by = "O8boEKCJjEMhVS9bbNjcpEunXaD2";
    genome.document_type = "sub_subcategory";
    const resultSetInfo = await pool.query('SELECT * from info_block WHERE genome_id = $1 and entity_type = 1', [genome.genome_id]);

    if (resultSetInfo.rowCount) {
        genome.html_encoded_info = resultSetInfo.rows.map( row => ({'html_encoded_text':row.content}));
    }else{
        genome.html_encoded_info = []
    }
    //clean response before sent it
    delete genome["id"];
    delete genome["name"];
    delete genome["genome_id"];
    delete genome["is_active"];
    delete genome["str_id"];
    delete genome["title"];
    delete genome["subtitle"];
    delete genome["type_id"];

    res.json({
        status: {
            code: 200,
            message: 'Success',
        },
        data: genome
    });
}

const getGeneCat = async (req, res = response) => {
    const { catId } = req.params;
    const query = 'select g.*, mc.id as genome_id from category as cat left join media_category as mc on mc.category_id = cat.id left join gene as g on mc.gene_id = g.id where cat.id = $1 and g.id is not null';
    const values = [catId];

    const resultSet = await pool.query(query, values);
    if (!resultSet.rowCount) {
        return res.status(400).json({
            status: {
                code: 400,
                message: 'This gene does not exist in DB',
            },
            data: null
        });
    }
    let genome = resultSet.rows[0];
    genome.category_id = catId;
    genome.subcategory_id = null;
    genome.subsubcategory_id = null;
    genome.created_by = "O8boEKCJjEMhVS9bbNjcpEunXaD2";
    genome.document_type = "sub_subcategory";
    const resultSetInfo = await pool.query('SELECT * from info_block WHERE genome_id = $1 and entity_type = 1', [genome.genome_id]);

    if (resultSetInfo.rowCount) {
        genome.html_encoded_info = resultSetInfo.rows.map( row => ({'html_encoded_text':row.content}));
    }else{
        genome.html_encoded_info = []
    }
    //clean response before sent it
    delete genome["id"];
    delete genome["name"];
    delete genome["genome_id"];
    delete genome["is_active"];
    delete genome["str_id"];
    delete genome["title"];
    delete genome["subtitle"];
    delete genome["type_id"];
    res.json({
        status: {
            code: 200,
            message: 'Success',
        },
        data: genome
    });
}

const createGeneDoc = async (req, res = response) => {
    console.log('create Gene Doc => ', req.body);
    const { title, subtitle, document_name, summary, description, long_description, version, archived, html_encoded_info, subsubcategory_id} = req.body;

    //Manual validation
    const resulset = await pool.query('SELECT * FROM media_category WHERE category_id = $1', [subsubcategory_id]);
    if (resulset.rowCount) {
        return res.status(400).json({
            ok: false,
            mjs: 'This gene already exists check it!'
        });
    }

    const query = 'INSERT INTO gene(title, subtitle, document_name, summary, description, long_description, is_active, archived, create_date, last_update_date, "version", type_id, created_by, last_updated_by) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *';
    const _query = 'INSERT INTO media_category (title, description, is_active, created_at, updated_at, media_id, category_id, doc_id, score_rule_id, gene_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
    const subquery = 'INSERT INTO info_block("content", is_active, created_at, updated_at, genome_id, entity_type) VALUES($1, $2, $3, $4, $5, $6)';
    const values = [title, subtitle, document_name, summary, description, long_description, true, archived, 'now()', null, version, null, 1, null];
    
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
        return res.status(201).json({
            status: {code: 201, message: 'success'},
            data: true,
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: {
                code: 500,
                message: 'Comunicate with system administradors',
            },
            data: null
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