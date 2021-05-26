/**
 * evets routes
 * host + /genes
 */
 const { Router } = require('express');
 const { check } = require('express-validator');
const { validateFields } = require('../middlewares/field-validator');
 const { getGenes, getGeneCats, getCats, getGene2Cats, getGeneCat, createGeneDoc } = require('../controllers/genes');


 const router = Router();
 
 router.get('/categories/', getCats);

 router.get('/list/', getGenes);
 
 router.get('/:catId/:scatId/:sscatId', getGeneCats);
 
 router.get('/:catId/:scatId', getGene2Cats);
 
 router.get('/:catId', getGeneCat); 

 router.post('/document/', 
 [
    check('subsubcategory_id', 'subsubcategory_id is a mandatory field').not().isEmpty(),
    validateFields
 ], 
 createGeneDoc);

 module.exports = router
 