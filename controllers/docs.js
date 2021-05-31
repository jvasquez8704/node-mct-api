const { response } = require('express');
const { pool } = require('../database/connect');


const getDocs =  async (req, res = response) => {
    const resulset = await pool.query('SELECT str_id as doc_id, title, subtitle FROM doc WHERE type_id = $1', [1]);
    const docs = resulset.rows;
    const data = docs.map( doc => {
      const { doc_id, title, subtitle } = doc;
      return { doc_id, title, subtitle };
    });
    res.json({
        ok: true,
        data: data
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

const helloWord =  async (req, res = response) => {
    res.json({
        ok: true,
        data: "Hello great people from MCT API!!!"
    });
};

const getGeneDoc = async (req, res = response) => {
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

const getDoc = async (req, res = response) => {
    const { docId } = req.params;
    // GET /p?tagId=5
    // const { tagId } = req.query.tagId
    // const token = await generateJWT(uid, name);
    const resultSet = await pool.query('SELECT * from doc WHERE id = $1', [docId]);
    const resultSetInfo = await pool.query('SELECT * from info_chunk WHERE doc_id = $1', [docId]);
    if (!resultSet.rowCount) {
        return res.status(400).json({
            ok: false,
            mjs: 'This doc does not exist in DB'
        });
    }
    let doc = resultSet.rows[0];
    if (resultSetInfo.rowCount) {
        const { content, title } = resultSetInfo.rows[0];
        doc.section = {};
        doc.section.subtitle = title;
        doc.section.html_encoded_section_info = content;
        // doc.html_encoded_info = resultSetInfo.rows.map( row => {
        //     let str_encoded = row.content.replace('\\\"', '"').replace('\\\"><','"><').replace('', '');
        //     console.log('str_encoded    ====>', str_encoded);
        //     return {'html_encoded_text': str_encoded};
        // });
        // doc.html_encoded_info = [
        //     {"rere":"<p><span style=\"font-size:14px\"><span style=\"font-family:'Times New Roman'\"><span style=\"color:#000000\"><strong><u>Setting Number: Singular-to-Multiple (1&ndash;5)</u></strong></span></span></span></p><p><span style=\"font-size:14px\"><span style=\"font-family:'Times New Roman'\"><span style=\"color:#000000\">This is a <strong>&ldquo;summary&rdquo; gene</strong>, meaning that it can only be determined when evaluating the show in its entirety. Specifically, this gene is asking <strong>how many settings</strong> &mdash; meaning <strong>locale </strong>(cities, towns, countries, etc.) <strong>or specific geographic locations </strong>(a desert island, Kingdom of Florin, etc.) &mdash; have a &ldquo;<strong><em>defining</em>&rdquo; or &ldquo;<em>primary</em>&rdquo; impact on the identity / experience of the show</strong>. In practical terms, this means counting the number of locales that you&rsquo;d <strong>score 2 or higher</strong>. While most films will utilize a small number of &ldquo;defining&rdquo; or &ldquo;primary&rdquo; settings, some (e.g., EASY RIDER, FORREST GUMP, etc.) utilize up to a dozen or more. Given this wide range, this gene utilizes a <strong>logarithm-like scale</strong> for its scores &mdash; namely:</span></span></span></p><p style=\"margin-left:33px;margin-bottom:6px\"><span style=\"font-size:14px\"><span style=\"font-family:'Times New Roman'\"><span style=\"color:#000000\"><strong>1</strong> = 1 setting</span></span></span></p><p style=\"margin-left:33px;margin-bottom:6px\"><span style=\"font-size:14px\"><span style=\"font-family:'Times New Roman'\"><span style=\"color:#000000\"><strong>1.5</strong> = 2 settings</span></span></span></p><p style=\"margin-left:33px;margin-bottom:6px\"><span style=\"font-size:14px\"><span style=\"font-family:'Times New Roman'\"><span style=\"color:#000000\"><strong>2</strong> = 3 settings</span></span></span></p><p style=\"margin-left:33px;margin-bottom:6px\"><span style=\"font-size:14px\"><span style=\"font-family:'Times New Roman'\"><span style=\"color:#000000\"><strong>2.5</strong> = 4 settings</span></span></span></p><p style=\"margin-left:33px;margin-bottom:6px\"><span style=\"font-size:14px\"><span style=\"font-family:'Times New Roman'\"><span style=\"color:#000000\"><strong>3</strong> = 5 settings</span></span></span></p><p style=\"margin-left:33px;margin-bottom:6px\"><span style=\"font-size:14px\"><span style=\"font-family:'Times New Roman'\"><span style=\"color:#000000\"><strong>3.5</strong> = 6-7 settings</span></span></span></p><p style=\"margin-left:33px;margin-bottom:6px\"><span style=\"font-size:14px\"><span style=\"font-family:'Times New Roman'\"><span style=\"color:#000000\"><strong>4</strong> = 8-10 settings</span></span></span></p><p style=\"margin-left:33px;margin-bottom:6px\"><span style=\"font-size:14px\"><span style=\"font-family:'Times New Roman'\"><span style=\"color:#000000\"><strong>4.5</strong> = 11-15 settings</span></span></span></p><p style=\"margin-left:33px\"><span style=\"font-size:14px\"><span style=\"font-family:'Times New Roman'\"><span style=\"color:#000000\"><strong>5</strong> = 16 + settings</span></span></span></p><p><span style=\"font-size:14px\"><span style=\"font-family:'Times New Roman'\"><span style=\"color:#000000\"><strong><u>Setting Clarity: Low-to-High (1&ndash;5)</u></strong></span></span></span></p><p><span style=\"font-size:14px\"><span style=\"font-family:'Times New Roman'\"><span style=\"color:#000000\">While in most cases the show&rsquo;s various location (i.e., its &ldquo;Locale&rdquo; or specific geographic locations) settings will be clearly defined &mdash; New York City, Punxsutawney, Pennsylvania (the setting of GROUNDHOG DAY), Mars, the South Pole, etc. &mdash; there is no shortage of shows that have an ambiguous or undefined setting. That uncertainty can be complete (e.g., NOAH &mdash; an unstated location), or specified with ambiguous dimensions (e.g., HUNGER GAMES &mdash;located in &ldquo;Panem&rdquo;, a fictional nation somewhere in North America), or somewhere in between, etc. As such, use the following whole-number gauge to define your ranking of the show&rsquo;s Locale:</span></span></span></p><p style=\"margin-left:33px;margin-bottom:6px\"><span style=\"font-size:14px\"><span style=\"font-family:'Times New Roman'\"><span style=\"color:#000000\"><strong>1</strong> = A complete lack of clarity on where the show is taking place in terms of a tangible Locale(s), neither city, state, country, continent, planet, etc.</span></span></span></p><p style=\"margin-left:33px;margin-bottom:6px\"><span style=\"font-size:14px\"><span style=\"font-family:'Times New Roman'\"><span style=\"color:#000000\"><strong>2</strong> = A notable lack of clarity as to where the show&rsquo;s precise Locale(s), though some hints of where in the world (or universe) this setting(s) is taking place</span></span></span></p><p style=\"margin-left:33px;margin-bottom:6px\"><span style=\"font-size:14px\"><span style=\"font-family:'Times New Roman'\"><span style=\"color:#000000\"><strong>3</strong> = A mix of settings between clear and unambiguous Locales, or a setting Locale that somehow is neither clear nor ambiguous, or both</span></span></span></p><p style=\"margin-left:33px;margin-bottom:6px\"><span style=\"font-size:14px\"><span style=\"font-family:'Times New Roman'\"><span style=\"color:#000000\"><strong>4</strong> = A use of substantially clear and unambiguous setting Locales, though with some element of ambiguity &mdash; e.g., a fictional city in a known state, or a limited use of an undefined or ambiguous setting within an otherwise clearly defined Locale</span></span></span></p><p style=\"margin-left:33px\"><span style=\"font-size:14px\"><span style=\"font-family:'Times New Roman'\"><span style=\"color:#000000\"><strong>5</strong> = The complete use of clear, unambiguous, and well-defined setting Locale(s) in the show</span></span></span></p><p><span style=\"font-size:14px\"><span style=\"font-family:'Times New Roman'\"><span style=\"color:#000000\"><strong><u>Fictional Representation of Real-World Setting (0, 1&ndash;5)</u></strong></span></span></span></p><p><span style=\"font-size:14px\"><span style=\"font-family:'Times New Roman'\"><span style=\"color:#000000\">Related to the previous gene, this one enables the Analyst to quantify the degree to which the setting Locales are not only fictional, but also are representative of real-world settings &mdash; one not explicitly stated. For example, FROZEN, is set in &ldquo;Arendelle&rdquo; &ndash; a fictional kingdom which, however, is based on several real-world locations in Norway. In some ways this is more of a metadata question than a genomic one, since you&rsquo;d need to know that the Locale is indeed fictional. Still, it will be useful to quantify genomically the degree to which a &ldquo;fictional representation of real-world setting&rdquo; impacts the identity and experience of the show. Of course, most shows will not utilize any fictional Locale, and thus this gene will score a 0; but if such a &ldquo;fictional representation&rdquo; Locale is utilized, use the following whole-number gauge to define your ranking:</span></span></span></p>"}
        // ];
    }
    //clean response before sent it
    doc.document_id = doc.str_id;
    doc.created_by = "O8boEKCJjEMhVS9bbNjcpEunXaD2";
    delete doc["id"];
    delete doc["subtitle"];
    delete doc["is_active"];
    delete doc["str_id"];
    delete doc["type_id"];
    res.json({
        status: {code: 200, message: "success"},
        data: doc
    });
};


const createDoc = async (req, res = response) => {

    console.log(req.body);
    const query = 'INSERT INTO doc(str_id, title, subtitle, document_name, summary, description, long_description, is_active, archived, create_date, last_update_date, "version", type_id, created_by, last_updated_by) VALUES($1, $2, $3, $4, $5)';
    const _query = 'INSERT INTO info_chunk("content", is_active, created_at, updated_at, doc_id) VALUES($1, $2, $3, $4, $5)';
    const values = [req.body.html_encoded_text, 'true', 'now()', null, 1];
    const _values = [req.body.html_encoded_text, 'true', 'now()', null, 1];

    res.status(201).json({
        ok: true,
        values
    });
    
    // try {
    //     const resulset = await pool.query(query, values);
    //     console.log('Resultado ', resulset);
    //     res.status(201).json({
    //         ok: true,
    //         values
    //     });

    // } catch (error) {
    //     console.log(error)
    //     return res.status(500).json({
    //         ok: false,
    //         payload: 'Comunicate con el administradors',
    //     });
    // }
};

const createDocTest = async (req, res = response) => {
    //console.log('createDocTest => ', req.body);
    let retVal = null;
    const { document_id, document_name, summary, description, long_description, created_by, last_updated_by, version, archived, document_info} = req.body;
    const { section, title } = document_info;
    const { subtitle, html_encoded_section_info } = section;
    const query = 'INSERT INTO doc(str_id, title, subtitle, document_name, summary, description, long_description, is_active, archived, create_date, last_update_date, "version", type_id, created_by, last_updated_by) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *';
    const subquery = 'INSERT INTO info_chunk(title, "content", is_active, created_at, updated_at, doc_id, type_id) VALUES($1, $2, $3, $4, $5, $6, $7)';
    const values = [document_id, title, subtitle, document_name, summary, description, long_description, true, archived, 'now()', null, version, 1, 1, null];
    
    try {
        const resulset = await pool.query(query, values);
        const { id } = resulset.rows[0];
        console.log('Resultado ', resulset.rows[0]);
        retVal = resulset.rows[0];
        retVal.section = section;
        if(section) {
            const sqValues = [subtitle, html_encoded_section_info, true, 'now()', null, id, 2];
            console.log('section =>', sqValues);
            await pool.query(subquery, sqValues);
        }
        res.status(201).json({
            status: {code: 201, message: 'doc created successfull'},
            data: retVal
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
    getDocs,
    getDoc,
    createDoc,
    createDocTest,
    getGeneDoc,
    getCats,
    helloWord
}