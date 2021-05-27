/**
 * evets routes
 * host + /genes
 */
 const { Router } = require('express');
 const { check } = require('express-validator');
 const { validateFields } = require('../middlewares/field-validator');
 const { getScoringRule, getScoringRuleCat, getScoringRule2Cats, createScoringRule } = require('../controllers/scoring-rules');


 const router = Router();
 
 router.get('/:catId/:scatId/:sscatId', getScoringRule);
 
 router.get('/:catId/:scatId', getScoringRule2Cats);
 
 router.get('/:catId', getScoringRuleCat); 

 router.post('/document/',[
    check('subsubcategory_id', 'subsubcategory_id is a mandatory field').not().isEmpty(),
    validateFields
 ], createScoringRule); 

 module.exports = router
 