/**
 * evets routes
 * host + /api/movies
 */
 const { Router } = require('express');
 const { getDocs, getDoc, createDocTest, getGeneDoc, helloWord, getCats } = require('../controllers/docs');


 const router = Router();
 
 router.get('/list/', getDocs);

 router.get('/categories/', getCats);
 
 router.get('/:docId', getDoc);
 
 router.get('/:catId/:scatId/:sscatId', getGeneDoc);
 
 router.get('/:catId/:scatId', getGeneDoc);
 
 router.get('/:docId', getDoc);
 
 router.post('/', createDocTest);

 router.get('/', helloWord);
 

 module.exports = router
 