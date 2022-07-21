let articles = localStorage.getItem("shoppingCart");
articles = JSON.parse(articles);
let price = 0;
let qte = 0;

async function createProducts()
{ 
    let price = 0;
    let qte = 0;
    for (let art of articles) {
        const articleId = art.id;
        const promise = await fetch("http://localhost:3000/api/products/"+articleId);
        const item = await promise.json();
        showArticle(item, art.color, art.quantity);
        price += item.price * art.quantity;
        qte += parseInt(art.quantity);
    }
    const sumPrice = document.getElementById('totalPrice');
    sumPrice.textContent = price;
    const sumQuantity = document.getElementById('totalQuantity');
    sumQuantity.textContent = qte;
}

async function loadCart()
{
    await createProducts();
    deleteEvents();
    editQuantity();
}

// Le bouton Commander
const form = document.querySelector(".cart__order__form");    // On récupère l'élément sur lequel on veut détecter le submit
form.addEventListener('submit', function(event) {          // On écoute l'événement submit
    event.preventDefault();
    
    let firstName = document.getElementById("firstName");
    let lastName = document.getElementById("lastName");
    let address = document.getElementById("address");
    let city = document.getElementById("city");
    let email = document.getElementById("email");

    let inputs = {
        "firstName" : document.getElementById("firstName").value,
        "lastName" : document.getElementById("lastName").value,
        "address" : document.getElementById("address").value,
        "city" : document.getElementById("city").value,
        "email" : document.getElementById("email").value
    }

    let err = 0;

    if(firstName.value.length < 3)
    {
        document.getElementById('firstNameErrorMsg').textContent = 'Votre prénom doit faire au moins 3 caractères.';
        err++;
    }    
    
    if(firstName.value.length > 20)
    {
        document.getElementById('firstNameErrorMsg').textContent = 'Votre prénom ne doit pas dépasser 20 caractères.';
        err++;
    }  
    
    if (!/^[a-zA-Z]*$/g.test(firstName.value))
    {
        document.getElementById('firstNameErrorMsg').textContent = 'Votre prénom ne doit pas contenir de chiffres.';
        err++;
    }

    if(lastName.value.length < 3)
    {
        document.getElementById('lastNameErrorMsg').textContent = 'Votre nom doit faire au moins 3 caractères.';
        err++;
    }    
    
    if(lastName.value.length > 20)
    {
        document.getElementById('lastNameErrorMsg').textContent = 'Votre nom ne doit pas dépasser 20 caractères.';
        err++;
    }   

    if(err == 0)
    {
        let articleIds = [];
        articles.forEach(function(article) {
            articleIds.push(article.id);
        });

        fetch("http://localhost:3000/api/order", {
            method: "POST",
            headers: {
              'Accept': 'application/json', 
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({contact:inputs, products:articleIds})
          })
          .then(function(res) {
            if (res.ok) {
              return res.json();
            }
          })
    }
});

function deleteEvents()
{
    // Le bouton Supprimer
    const delButton = document.querySelectorAll(".deleteItem");    // On récupère l'élément sur lequel on veut détecter le clic
    for (let btn of delButton) {
        btn.addEventListener('click', function(event) {          // On écoute l'événement click
            event.preventDefault();
            let articleid = event.target.closest('article').dataset.id;
            let articleColor = event.target.closest('article').dataset.color;
            let index = getCurrent(articleid, articleColor);
            articles.splice(index, 1);
            localStorage.setItem("shoppingCart", JSON.stringify(articles));
            document.getElementById('cart__items').innerHTML = '';
            window.location.href = window.location.href;
        });
    }
}

function editQuantity()
{
    // Le bouton Modifier
    const editButton = document.querySelectorAll(".itemQuantity");    // On récupère l'élément sur lequel on veut détecter le changement
    for (let btn of editButton) {
        btn.addEventListener('change', function(event) {          // On écoute l'événement change
            event.preventDefault();
            articleQuantity = event.target.value;
            let articleid = event.target.closest('article').dataset.id;
            let articleColor = event.target.closest('article').dataset.color;
            let index = getCurrent(articleid, articleColor);
            articles[index]['quantity'] = articleQuantity;
            localStorage.setItem("shoppingCart", JSON.stringify(articles));
            window.location.href = window.location.href;
        });
    }
}

loadCart();

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
    return index;
}