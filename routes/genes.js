/**
 * evets routes
 * host + /genes
 */
 const { Router } = require('express');
 const { getGenes, getGeneCats, getCats, getGene2Cats, getGeneCat } = require('../controllers/genes');


 const router = Router();
 
 router.get('/categories/', getCats);

 router.get('/list/', getGenes);
 
 router.get('/:catId/:scatId/:sscatId', getGeneCats);
 
 router.get('/:catId/:scatId', getGene2Cats);
 
 router.get('/:catId', getGeneCat); 

 module.exports = router
 