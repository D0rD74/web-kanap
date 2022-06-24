fetch("http://localhost:3000/api/products").then(function(res) {
    if (res.ok) {
      return res.json();
    }
})
.then(function(articles) {
  articles.forEach(function(article) {
    showAllArticles(article);
  });
})
.catch(function(err) {
  // Une erreur est survenue  
});
const items = document.getElementById('items');
function showAllArticles(article) {
  const items = document.getElementById('items');
  const a = document.createElement('a');
  const container = document.createElement('article');
  const img = document.createElement('img');
  const imgAlt = article.altTxt;
  const title = document.createElement('h3');
  const description = document.createElement('p');

  a.href = './product.html?id='+article._id;
  img.src = article.imageUrl;
  img.alt = imgAlt;
  title.classList.add('productName');
  title.textContent = article.name;
  description.classList.add('productDescription');
  description.textContent = article.description;

  items.appendChild(a).appendChild(container).appendChild(img).parentNode.insertBefore(title, img.nextSibling).parentNode.insertBefore(description, title.nextSibling);
  
}