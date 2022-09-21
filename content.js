const homePage=(response)=>{
    response.end("<h1>Welcome To Home Page ...</h1>");
}
const aboutPage=(response)=>{
    response.end("<h1>Welcome To About Page ....</h1>");
}
const pageNotFound=(response)=>{
    response.end("<h1>Page Not Found ...(</h1>");
}
const content={
    homePage,
    aboutPage,
    pageNotFound
}
module.exports=content;
