let articles = localStorage.getItem("shoppingCart");
articles = JSON.parse(articles);
let price = 0;

function createProducts()
{
    articles.forEach(function(cart, idx, array){
        const articleId = cart.id;
        fetch("http://localhost:3000/api/products/"+articleId).then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(item) {
            showArticle(item, cart.color, cart.quantity);
            price += item.price * cart.quantity;

            if (idx === array.length - 1){ 
                const sumPrice = document.getElementById('totalPrice');
                sumPrice.textContent = price;
            }
        })
        .catch(function(err) {
            // Une erreur est survenue  
        });
    });
}

async function loadCart()
{
    const products = await createProducts();
    deleteEvents();
}

function deleteEvents()
{
    // Le clic Supprimer
    const button = document.querySelectorAll(".deleteItem");    // On récupère l'élément sur lequel on veut détecter le clic
    for (let btn in button) {
        btn.addEventListener('click', function(event) {          // On écoute l'événement click
            event.preventDefault();
            var articleid = event.target.closest('article').dataset.id;
            console.log(articleid);
        });
    }
}

loadCart();

const sumQuantity = document.getElementById('totalQuantity');
sumQuantity.textContent = totalQuantity(articles);


function totalQuantity(articles)
{
    const sumQuantity = articles.reduce(
        (previousValue, currentValue) => Number(previousValue) + Number(currentValue.quantity),
        0
      );    

    return sumQuantity;
}

function showArticle(item, color, quantity)
{
    const items = document.getElementById('cart__items');
    const article = document.createElement('article');

    article.classList.add('cart__item');
    article.dataset.id = item._id;
    article.dataset.color = color;
    items.appendChild(article);

    const img_container = document.createElement('div');
    img_container.classList.add('cart__item__img');
    article.appendChild(img_container);

    const img = document.createElement('img');
    const imgAlt = item.altTxt;
    img.alt = imgAlt;
    img.src = item.imageUrl;
    img_container.appendChild(img);

    const content_container = document.createElement('div');
    content_container.classList.add('cart__item__content');
    img_container.parentNode.insertBefore(content_container, img_container.nextSibling);

    const description_container = document.createElement('div');
    description_container.classList.add('cart__item__content__description');
    content_container.appendChild(description_container);

    const title = document.createElement('h2');
    title.textContent = item.name;
    
    const addcolor = document.createElement('p');
    addcolor.textContent = color;

    const price = document.createElement('p');
    price.textContent = item.price+' €';

    description_container.appendChild(title)
    description_container.appendChild(addcolor)
    description_container.appendChild(price);

    const settings_container = document.createElement('div');
    settings_container.classList.add('cart__item__content__settings');
    description_container.parentNode.insertBefore(settings_container, description_container.nextSibling);

    const quantity_container = document.createElement('div');
    quantity_container.classList.add('cart__item__content__settings__quantity');
    settings_container.appendChild(quantity_container);

    const quantity_label = document.createElement('p');
    quantity_label.textContent = 'Qté :';
    quantity_container.appendChild(quantity_label);

    const quantity_input = document.createElement('input');
    quantity_input.setAttribute("type", "number");
    quantity_input.classList.add('itemQuantity');
    quantity_input.setAttribute("name", "itemQuantity");
    quantity_input.setAttribute("min", "1");
    quantity_input.setAttribute("max", "100");
    quantity_input.value=quantity;
    quantity_container.appendChild(quantity_input);

    const settings_delete_container = document.createElement('div');
    settings_delete_container.classList.add('cart__item__content__settings__delete');
    quantity_container.parentNode.insertBefore(settings_delete_container, quantity_container.nextSibling);

    const deleteItem = document.createElement('p');
    deleteItem.classList.add('deleteItem');
    deleteItem.textContent = 'Supprimer';

    settings_delete_container.appendChild(deleteItem);
}

function store(cart)
{
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

function getCurrent(article_id, color)
{
    let index = articles.findIndex((item) => item.id === article_id && item.color === color);
}