const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/*
*GET
*HOME
*/
router.get('', async (req, res)=>{
    try{
        /*
        This object 'locals' holds information that can be used in the EJS template,
         such as the page title and description
        */

        const locals = {
            title: "nodejs blog",
            description: "Simple blog created with nodejs, Express & mongoDb"
        }
    
        /*
        Post.aggregate(...): Uses MongoDB's aggregation framework to sort posts by the createdAt field in descending order.
        .skip(...): Skips over the posts from previous pages based on the current page number.
        .limit(...): Limits the results to the number specified by perPage.
        */
        let perPage = 6;
        let page = req.query.page || 1;
        const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
    
        const count = await Post.countDocuments({});
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);
    
    
 
        res.render('index', { 
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
             currentRoute: '/'
          });

    } catch(error){
        console.log(error);
    }

});

/*
*GET
*POST
*/


 router.get('/post/:id', async (req, res) => {
   try {
    
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug })

    const locals = {
        title: data.title,
        description: "Simple Blog created with NodeJs, Express & MongoDb."
      }

     res.render('post', {
       locals, 
       data,
      currentRoute: `/post/${slug}`
       });

    } catch (error) {
     console.log(error);
   }

 });


/*
*searchTerm
*POST
*/


router.post('/search', async (req, res) => {

    try {

        const locals = {
            title: "Search",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
          }
        let searchTerm = req.body.searchTerm;
        
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

        const data = await Post.find({
          $or: [
            { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
            { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
          ]
        });
        
        res.render("search", {
            data,
            locals,
            currentRoute: '/search'
        })
     } catch (error) {
      console.log(error);
    }
 
  });
 



router.get('/about', (req, res)=>{
    
    res.render('about', {
      currentRoute: '/about'
    });
});


module.exports = router;