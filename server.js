const express = require('express');
const layouts = require('express-ejs-layouts');
const fs = require('fs');
const PORT = 3000;
const app = express();
const methodOverride = require('method-override'); //NEW for method override

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false})); // telling it don't use extended
app.use(layouts);
app.use(express.static(__dirname + '/static'));
app.use(methodOverride('_method')); //NEW middleware where post will change


app.get('/', function(req, res) {
    res.send('you hit the root route')
});

app.get('/articles', function(req, res) {
    var articles = fs.readFileSync('./articles.json');
    var articleData = JSON.parse(articles);
    res.render('articles/index', {articleData})
});
//GET/ articles/new - serve up our NEW article form
app.get('/articles/new', function(req, res){
    res.render('articles/new');
});



//GET/ articles/:id/EDIT - serve up our EDIT article form
app.get('/articles/:id/edit', function(req, res){
    var articles = fs.readFileSync ('./articles.json');
    var articleData = JSON.parse(articles);
    var id = parseInt(req.params.id);
    res.render('articles/edit', {articles: articleData[id], id});
   
  });
//get ONE
app.get('/articles/:id', function(req, res) {
    var articles = fs.readFileSync('./articles.json');
    var articleData = JSON.parse(articles);
    var id = parseInt(req.params.id);
    res.render('articles/show', {article: articleData[id], id});

});

//POST
//post /articles
app.post('/articles', function(req, res) {
    //read in our JSON file
    var articles = fs.readFileSync('./articles.json');
    //convert it to an array
    var articleData = JSON.parse(articles);
    //push it to an array
    var myArticle = {
        title: req.body.articleTitle,
        body: req.body.articleBody
    }
    articleData.push(myArticle);
    //write the array back to the file
    fs.writeFileSync('./articles.json', JSON.stringify(articleData));

   res.redirect('/articles');
});

//PUT 
app.put('/articles/:id', function(req, res) {
    var articles = fs.readFileSync('./articles.json');
    var articleData = JSON.parse(articles);
    var id = parseInt(req.params.id);
    articleData[id].title = req.body.articleTitle;
    articleData[id].body = req.body.articleBody;
    fs.writeFileSync('./articles.json', JSON.stringify(articleData));
    res.redirect('/articles/' + id);
})

//DELETE
app.delete('/articles/:id', function(req,res) {
    //read the data from the file
    var articles = fs.readFileSync('./articles.json');
    //Parse the data into an object
    var articleData = JSON.parse(articles);
    //Splice out the item at the specified index
    var id = parseInt(req.params.id);
    articleData.splice(id, 1);
    //Stringify the object
    var articleString = JSON.stringify(articleData);
    //write the object back to the file
    fs.writeFileSync('./articles.json', articleString);
    //redirect to main
    res.redirect('/articles');
})


app.listen( PORT || 3000 );
