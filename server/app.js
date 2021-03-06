
var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
{mongoose} = require('./db/mongoose'),
express 	   = require("express"),
app 		   = express();


app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
const port = process.env.PORT || 3000;



var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body:  String,
	created: {type: Date ,default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title: "Test Blog",
// 	image: "https://static.pexels.com/photos/36436/dalmatians-dog-animal-head.jpg",
// 	body: "hello this is a blog post"
// });

app.get("/",function(req,res) {
	console.log("route /");
	res.redirect("/blogs");
});


app.get("/blogs",function(req,res) {
	console.log("route /blogs");
	Blog.find({},function(err, blogs) {
		if(err)
		{
			console.log("err");
		}
		else
		{
			console.log("render to index");
	  		 res.render("index",{blogs:blogs});
		}
	});

});

app.get("/blogs/new", function(req,res){
	res.render("new");
});


// CREATE ROUTE
app.post("/blogs",function(req,res) {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err,newBlog) {
		if(err){
			res.render("new");
		}
		else{
			res.redirect("/blogs");
		}
	});
});

//SHOW ROUTE
app.get("/blogs/:id",function(req,res) {
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("show",{blog:foundBlog});
		}
	});
});



//EDIT ROUTE
app.get("/blogs/:id/edit",function(req,res) {
	Blog.findById(req.params.id,function(err,foundBlog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.render("edit",{blog:foundBlog});
		}
	});
});


//UPDATE ROUTE
app.put("/blogs/:id",function(req,res) {
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog) {
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res) {
	Blog.findByIdAndRemove(req.params.id,function(err){

		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	});
});

app.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
