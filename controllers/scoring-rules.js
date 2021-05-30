const { response } = require('express');
const { pool } = require('../database/connect');
const ENTITY_ID = 2; 



const getScoringRule = async (req, res = response) => {
    const { catId, scatId, sscatId } = req.params;
    const query = 'select s.*, mc.id as genome_id from category as sscat left join category as scat on sscat.parent_id = scat.id left join media_category as mc on mc.category_id = sscat.id left join score_rule as s on mc.score_rule_id = s.id where sscat.id = $1 and scat.id = $2 and scat.parent_id = $3 and s.id is not null';
    const values = [sscatId, scatId, catId];

    const resultSet = await pool.query(query, values);
    if (!resultSet.rowCount) {
      return res.status(404).json({
        status: {
          code: 404,
          mjs: "This score rule does not exist in DB",
        },
      });
    }
    let genome = resultSet.rows[0];
    genome.category_id = catId;
    genome.subcategory_id = scatId;
    genome.subsubcategory_id = sscatId;
    genome.created_by = "O8boEKCJjEMhVS9bbNjcpEunXaD2";
    genome.document_type = "sub_subcategory";
    const resultSetInfo = await pool.query('SELECT * from info_block WHERE genome_id = $1 and entity_type = 2', [genome.genome_id]);

    if (resultSetInfo.rowCount) {
        genome.html_encoded_info = resultSetInfo.rows.map( row => ({'html_encoded_text':row.content}));
    }else{
        genome.html_encoded_info = []
    }
    delete genome["id"];
    delete genome["name"];
    delete genome["genome_id"];
    delete genome["is_active"];
    delete genome["str_id"];
    delete genome["title"];
    delete genome["subtitle"];
    delete genome["type_id"];
    res.json(genome);
}

const getScoringRule2Cats = async (req, res = response) => {
    const { catId, scatId } = req.params;
    const query = 'select s.*, mc.id as genome_id from category as scat left join media_category as mc on mc.category_id = scat.id left join score_rule as s on mc.score_rule_id = s.id where scat.id = $1 and scat.parent_id = $2 and s.id is not null';
    const values = [scatId, catId];

    const resultSet = await pool.query(query, values);
    if (!resultSet.rowCount) {
        return res.status(400).json({
            ok: false,
            mjs: 'This gene does not exist in DB'
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
    res.json(genome);
}

const getScoringRuleCat = async (req, res = response) => {
    const { catId } = req.params;
    const query = 'select s.*, mc.id as genome_id from category as cat left join media_category as mc on mc.category_id = cat.id left join score_rule as s on mc.score_rule_id = s.id where cat.id = $1 and s.id is not null';
    const values = [catId];

    const resultSet = await pool.query(query, values);
    if (!resultSet.rowCount) {
        return res.status(400).json({
            ok: false,
            mjs: 'This gene does not exist in DB'
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
    res.json(genome);
}


const createScoringRule = async (req, res = response) => {
    console.log('create Scoring Rule Doc => ', req.body);
    const { title, subtitle, document_name, summary, description, long_description, version, archived, html_encoded_info, subsubcategory_id} = req.body;

    //If genome does not exist
    const resulset_cm = await pool.query('SELECT * FROM media_category WHERE category_id = $1', [subsubcategory_id]);
    if (!resulset_cm.rowCount) {
        return res.status(404).json({
            status: {
                code: 404,
                message: `For now, you must create the gene for ${subsubcategory_id} category.`
            },
        });
    }
    const [score_rule] = resulset_cm.rows;
    const { score_rule_id } = score_rule;
    
    if (score_rule_id) {
      return res.status(400).json({
        status: {
          code: 400,
          message: `The score rule for ${subsubcategory_id} category already exist.`,
        }
      });
    }
    console.log("genome => ", score_rule);

    const query = 'INSERT INTO score_rule(title, subtitle, document_name, summary, description, long_description, is_active, archived, create_date, last_update_date, "version", type_id, created_by, last_updated_by) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *';
    const _query = 'UPDATE media_category SET updated_at = $1, score_rule_id = $2 WHERE category_id = $3 RETURNING *';
    const subquery = 'INSERT INTO info_block("content", is_active, created_at, updated_at, genome_id, entity_type) VALUES($1, $2, $3, $4, $5, $6)';
    const values = [title, subtitle, document_name, summary, description, long_description, true, archived, 'now()', null, version, null, 1, null];
    
    try {
        const resulsetInsertScoreRule = await pool.query(query, values);
        const { id } = resulsetInsertScoreRule.rows[0];
        const _values = ['now()', id, subsubcategory_id];
        const resulsetUpdateGenome = await pool.query(_query, _values);
        const { id:genome_id } = resulsetUpdateGenome.rows[0];
        console.log('Updated Genome:', resulsetUpdateGenome.rows[0]);
        if(html_encoded_info.length > 0) {
            html_encoded_info.map( async item => {
                const { html_encoded_text } = item;
                const sqValues = [html_encoded_text, 'true', 'now()', null, genome_id, ENTITY_ID];//entity_type, 1=gene, 2=scoring_rule
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
            message: "An error has ocurred,check it",
          },
        });
    }
}

module.exports = {
    getScoringRule,
    getScoringRule2Cats,
    createScoringRule,
    getScoringRuleCat
}