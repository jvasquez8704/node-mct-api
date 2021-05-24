/**
 * evets routes
 * host + /genes
 */
 const { Router } = require('express');
 const { getScoringRule, getScoringRuleCat, getScoringRule2Cats } = require('../controllers/scoring-rules');


 const router = Router();
 
 router.get('/:catId/:scatId/:sscatId', getScoringRule);
 
 router.get('/:catId/:scatId', getScoringRule2Cats);
 
 router.get('/:catId', getScoringRuleCat); 

 module.exports = router
 