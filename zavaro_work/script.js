const products = [

  {
    id: 1,
    name: 'Heavyweight T-Shirt',
    price: 79,
    cat: 'tops',
    color: 'Jet Black',
    sizes: ['S','M','L','XL'],
    image: 'assets/images/board_1_crops/01_signature_tee1.jpg',
    desc: '240–280 GSM premium combed cotton with a clean ZAVARO chest mark and signature sleeve detail.',
    badge: 'Foundation'
  },

  {
    id: 2,
    name: 'Oversized T-Shirt',
    price: 84,
    cat: 'tops',
    color: 'Ivory',
    sizes: ['S','M','L','XL'],
    image: 'assets/images/board_1_crops/02_oversized_tee1.jpg',
    desc: 'Relaxed heavyweight silhouette designed for everyday confidence.',
    badge: 'New'
  },

  {
    id: 3,
    name: 'Premium Hoodie',
    price: 129,
    cat: 'hoodies',
    color: 'Jet Black',
    sizes: ['S','M','L','XL'],
    image: 'assets/images/board_1_crops/03_premium_hoodie1.jpg',
    desc: '420–500 GSM French terry / fleece with an oversized fit and tonal ZV back identity.',
    badge: 'Featured'
  },

  {
    id: 4,
    name: 'Zip Hoodie',
    price: 139,
    cat: 'hoodies',
    color: 'Washed Black',
    sizes: ['S','M','L','XL'],
    image: 'assets/images/board_1_crops/04_zip_hoodie1.jpg',
    desc: 'A structured zip hoodie with substantial fabric and understated branding.',
    badge: 'New'
  },

  {
    id: 5,
    name: 'Longsleeve',
    price: 92,
    cat: 'tops',
    color: 'Jet Black',
    sizes: ['S','M','L','XL'],
    image: 'assets/images/board_1_crops/05_longsleeve1.jpg',
    desc: 'Clean long-sleeve essential finished with subtle ZAVARO identity.',
    badge: ''
  },

  {
    id: 6,
    name: 'Sweatpants',
    price: 109,
    cat: 'bottoms',
    color: 'Jet Black',
    sizes: ['S','M','L','XL'],
    image: 'assets/images/board_1_crops/06_sweatpants1.jpg',
    desc: 'Heavyweight fleece sweatpants with a relaxed leg and signature ZV detail.',
    badge: ''
  },

  {
    id: 7,
    name: 'Cargo Pants',
    price: 119,
    cat: 'bottoms',
    color: 'Dark Olive',
    sizes: ['S','M','L','XL'],
    image: 'assets/images/board_1_crops/07_cargo_pants1.jpg',
    desc: 'Utility-inspired cargo pants balancing function with the ZAVARO silhouette.',
    badge: 'New'
  },

  {
    id: 8,
    name: 'Track Jacket',
    price: 139,
    cat: 'outerwear',
    color: 'Jet Black',
    sizes: ['S','M','L','XL'],
    image: 'assets/images/board_1_crops/08_track_jacket1.jpg',
    desc: 'Lightweight track jacket with clean piping, structured shape and back branding.',
    badge: ''
  },

  {
    id: 9,
    name: 'Nylon Jacket',
    price: 149,
    cat: 'outerwear',
    color: 'Jet Black',
    sizes: ['S','M','L','XL'],
    image: 'assets/images/board_1_crops/09_nylon_jacket1.jpg',
    desc: 'Technical everyday layer with a quiet oversized ZAVARO back mark.',
    badge: ''
  },

  {
    id: 10,
    name: 'Mesh Shorts',
    price: 69,
    cat: 'bottoms',
    color: 'Jet Black',
    sizes: ['S','M','L','XL'],
    image: 'assets/images/board_1_crops/10_mesh_shorts1.jpg',
    desc: 'Lightweight mesh shorts designed for movement and everyday wear.',
    badge: ''
  },

  {
    id: 11,
    name: 'ZV Cap',
    price: 49,
    cat: 'headwear',
    color: 'Bone',
    sizes: ['One Size'],
    image: 'assets/images/board_1_crops/headwear1.jpg',
    desc: 'Adjustable cotton twill cap with the ZV monogram.',
    badge: 'Accessory'
  }

];


const $ = s => document.querySelector(s);

const $$ = s => [
  ...document.querySelectorAll(s)
];


let cart = JSON.parse(
  localStorage.getItem('zavaro-cart') || '[]'
);

let wishlist = JSON.parse(
  localStorage.getItem('zavaro-wishlist') || '[]'
);


let selected = null;
let selectedSize = null;
let selectedColor = null;

let currentList = products;


const money = n =>
  `$${Number(n).toFixed(2)}`;


/* ========================================
   TOAST
======================================== */

function toast(message) {

  const element = $('#toast');

  element.textContent = message;

  element.classList.add('show');

  setTimeout(() => {
    element.classList.remove('show');
  }, 1900);

}


/* ========================================
   SAVE CART / WISHLIST
======================================== */

function save() {

  localStorage.setItem(
    'zavaro-cart',
    JSON.stringify(cart)
  );

  localStorage.setItem(
    'zavaro-wishlist',
    JSON.stringify(wishlist)
  );

  renderBag();

}


/* ========================================
   PRODUCTS
======================================== */

function renderProducts(list = products) {

  $('#productCount').textContent =
    `${list.length} pieces`;

  $('#products').innerHTML = list.map(p => `

    <article
      class="product-card"
      data-id="${p.id}"
    >

      <div class="product-image">

        <img
          src="${p.image}"
          alt="${p.name}"
        >

        ${
          p.badge
            ? `<span class="badge">${p.badge}</span>`
            : ''
        }

        <button
          class="heart ${wishlist.includes(p.id) ? 'active' : ''}"
          data-heart="${p.id}"
          aria-label="Add ${p.name} to wishlist"
        >
          ${wishlist.includes(p.id) ? '♥' : '♡'}
        </button>

        <button
          class="quick"
          data-add="${p.id}"
        >
          Add to bag
        </button>

      </div>


      <div class="product-info">

        <h3>
          ${p.name}
        </h3>

        <p>
          ${p.color} · ${p.cat}
        </p>

        <div class="price">
          ${money(p.price)}
        </div>

      </div>

    </article>

  `).join('');

}


/* ========================================
   ADD TO CART
======================================== */

function addToCart(
  id,
  size = null,
  color = null
) {

  const product =
    products.find(x => x.id === id);

  if (!product) return;


  size = size || product.sizes[0];

  color = color || product.color;


  const key =
    `${id}-${size}-${color}`;


  const old =
    cart.find(x => x.key === key);


  if (old) {

    old.qty++;

  } else {

    cart.push({
      ...product,
      key,
      size,
      color,
      qty: 1
    });

  }


  save();

  toast(
    `${product.name} added to your bag`
  );

}


/* ========================================
   RENDER BAG
======================================== */

function renderBag() {

  const count =
    cart.reduce(
      (sum, item) => sum + item.qty,
      0
    );


  $('#bagCount').textContent = count;


  const empty = !cart.length;


  $('#bagEmpty').style.display =
    empty ? 'block' : 'none';


  $('#bagItems').innerHTML =
    empty
      ? ''
      : cart.map(item => `

        <div class="bag-row">

          <div
            class="bag-thumb"
            style="background-image:url('${item.image}')"
          ></div>


          <div>

            <h4>
              ${item.name}
            </h4>

            <p>
              ${item.color} · ${item.size}
            </p>

            <p>
              ${money(item.price)}
            </p>


            <div class="qty">

              <button
                data-qty="${item.key}"
                data-change="-1"
              >
                −
              </button>

              <span>
                ${item.qty}
              </span>

              <button
                data-qty="${item.key}"
                data-change="1"
              >
                +
              </button>

            </div>

          </div>


          <button
            class="remove"
            data-remove="${item.key}"
          >
            Remove
          </button>

        </div>

      `).join('');


  const subtotal =
    cart.reduce(
      (sum, item) =>
        sum + item.price * item.qty,
      0
    );


  $('#subtotal').textContent =
    money(subtotal);

}


/* ========================================
   BAG
======================================== */

function openBag() {

  renderBag();

  $('#bag').classList.add('open');

  $('#overlay').classList.add('show');

  document.body.classList.add('lock');

}


function closeBag() {

  $('#bag').classList.remove('open');

  $('#overlay').classList.remove('show');

  document.body.classList.remove('lock');

}


/* ========================================
   PRODUCT MODAL
======================================== */

function openProduct(id) {

  selected =
    products.find(x => x.id === id);

  if (!selected) return;


  selectedSize =
    selected.sizes[0];

  selectedColor =
    selected.color;


  $('#modalImage').style.backgroundImage =
    `url('${selected.image}')`;


  $('#modalCategory').textContent =
    `${selected.cat} · ${selected.color}`;


  $('#modalName').textContent =
    selected.name;


  $('#modalPrice').textContent =
    money(selected.price);


  $('#modalDesc').textContent =
    selected.desc;


  $('#colorOptions').innerHTML =
    [
      'Jet Black',
      'Ivory',
      'Charcoal',
      'Stone',
      'Deep Olive'
    ]
    .map(color => `

      <button
        class="${color === selectedColor ? 'active' : ''}"
        data-color="${color}"
      >
        ${color}
      </button>

    `)
    .join('');


  $('#sizeOptions').innerHTML =
    selected.sizes
      .map(size => `

        <button
          class="${size === selectedSize ? 'active' : ''}"
          data-size="${size}"
        >
          ${size}
        </button>

      `)
      .join('');


  $('#productModal').classList.add('open');

}


function closeModal() {

  $('#productModal')
    .classList
    .remove('open');

}


/* ========================================
   SEARCH
======================================== */

function renderSearch(query = '') {

  const list =
    products.filter(product =>
      (
        product.name +
        ' ' +
        product.cat +
        ' ' +
        product.color
      )
      .toLowerCase()
      .includes(query.toLowerCase())
    );


  $('#searchResults').innerHTML =
    list.map(product => `

      <div
        class="search-result"
        data-search-id="${product.id}"
      >

        <img
          src="${product.image}"
          alt="${product.name}"
        >

        <b>
          ${product.name}
        </b>

        <span>
          ${money(product.price)}
        </span>

      </div>

    `).join('')
    ||
    `
      <p style="color:#75695f;font-size:13px">
        No pieces found.
      </p>
    `;

}


/* ========================================
   CHECKOUT
======================================== */

const checkoutOverlay =
  $('#checkoutOverlay');

const checkoutForm =
  $('#checkoutForm');

const checkoutClose =
  $('#checkoutClose');

const successOverlay =
  $('#successOverlay');

const successClose =
  $('#successClose');


function openCheckout() {

  if (!cart.length) {

    toast(
      'Your bag is empty'
    );

    return;

  }


  closeBag();

  checkoutOverlay.classList.add('active');

  document.body.classList.add('lock');

}


function closeCheckout() {

  checkoutOverlay.classList.remove('active');

  document.body.classList.remove('lock');

}


function showSuccess() {

  successOverlay.classList.add('active');

  document.body.classList.add('lock');

}


function closeSuccess() {

  successOverlay.classList.remove('active');

  document.body.classList.remove('lock');

}


/* ========================================
   CHECKOUT CLOSE
======================================== */

checkoutClose.addEventListener(
  'click',
  closeCheckout
);


successClose.addEventListener(
  'click',
  closeSuccess
);


/* ========================================
   CLICK OUTSIDE CHECKOUT
======================================== */

checkoutOverlay.addEventListener(
  'click',
  event => {

    if (
      event.target ===
      checkoutOverlay
    ) {
      closeCheckout();
    }

  }
);


successOverlay.addEventListener(
  'click',
  event => {

    if (
      event.target ===
      successOverlay
    ) {
      closeSuccess();
    }

  }
);


/* ========================================
   PLACE ORDER
======================================== */

checkoutForm.addEventListener(
  'submit',
  event => {

    event.preventDefault();


    if (!cart.length) {

      toast(
        'Your bag is empty'
      );

      closeCheckout();

      return;

    }


    const name =
      $('#customerName')
        .value
        .trim();


    const phone =
      $('#customerPhone')
        .value
        .trim();


    const email =
      $('#customerEmail')
        .value
        .trim();


    if (!name || !phone) {

      toast(
        'Please complete your details'
      );

      return;

    }


    const subtotal =
      cart.reduce(
        (sum, item) =>
          sum + item.price * item.qty,
        0
      );


    /*
      ORDER OBJECT

      This is structured so we can later
      send exactly the same data to Node.js
      and PostgreSQL.
    */

    const order = {

      id:
        `ZV-${Date.now()}`,

      customer: {

        name,

        phone,

        email

      },

      paymentMethod:
        'Cash on Delivery',

      items:
        cart.map(item => ({

          productId: item.id,

          name: item.name,

          price: item.price,

          quantity: item.qty,

          size: item.size,

          color: item.color,

          image: item.image

        })),

      subtotal,

      status:
        'Pending',

      createdAt:
        new Date().toISOString()

    };


    /*
      TEMPORARY FRONTEND STORAGE

      Later this exact object will be
      POSTed to the Node.js backend.
    */

    const orders =
      JSON.parse(
        localStorage.getItem(
          'zavaro-orders'
        ) || '[]'
      );


    orders.push(order);


    localStorage.setItem(
      'zavaro-orders',
      JSON.stringify(orders)
    );


    console.log(
      'ZAVARO ORDER:',
      order
    );


    /* Clear cart */

    cart = [];


    localStorage.setItem(
      'zavaro-cart',
      JSON.stringify(cart)
    );


    renderBag();


    /* Reset checkout */

    checkoutForm.reset();


    /* Close checkout */

    closeCheckout();


    /* Show success */

    showSuccess();

  }
);


/* ========================================
   INITIAL RENDER
======================================== */

renderProducts();

renderBag();

renderSearch();


/* ========================================
   PRODUCT GRID EVENTS
======================================== */

$('#products').addEventListener(
  'click',
  event => {

    const add =
      event.target.closest(
        '[data-add]'
      );


    const heart =
      event.target.closest(
        '[data-heart]'
      );


    const card =
      event.target.closest(
        '.product-card'
      );


    if (add) {

      event.stopPropagation();

      openProduct(
        Number(add.dataset.add)
      );

      return;

    }


    if (heart) {

      event.stopPropagation();


      const id =
        Number(heart.dataset.heart);


      wishlist =
        wishlist.includes(id)
          ? wishlist.filter(
              x => x !== id
            )
          : [...wishlist, id];


      save();

      renderProducts(currentList);

      return;

    }


    if (card) {

      openProduct(
        Number(card.dataset.id)
      );

    }

  }
);


/* ========================================
   FILTERS
======================================== */

$('#filters').addEventListener(
  'click',
  event => {

    const button =
      event.target.closest('button');


    if (!button) return;


    $$('#filters button')
      .forEach(item =>
        item.classList.remove('active')
      );


    button.classList.add('active');


    const filter =
      button.dataset.filter;


    currentList =
      filter === 'all'
        ? products
        : products.filter(
            product =>
              product.cat === filter
          );


    renderProducts(currentList);

  }
);


/* ========================================
   BAG BUTTONS
======================================== */

$('#bagBtn').onclick =
  openBag;


$('#bagClose').onclick =
  closeBag;


$('#overlay').onclick =
  closeBag;


/* ========================================
   CHECKOUT BUTTON
======================================== */

$('#checkoutBtn').onclick =
  openCheckout;


/* ========================================
   BAG QUANTITY / REMOVE
======================================== */

$('#bagItems').addEventListener(
  'click',
  event => {

    const quantityButton =
      event.target.closest(
        '[data-qty]'
      );


    const removeButton =
      event.target.closest(
        '[data-remove]'
      );


    if (quantityButton) {

      const item =
        cart.find(
          product =>
            product.key ===
            quantityButton.dataset.qty
        );


      if (item) {

        item.qty +=
          Number(
            quantityButton.dataset.change
          );


        if (item.qty <= 0) {

          cart =
            cart.filter(
              product =>
                product.key !== item.key
            );

        }


        save();

      }

    }


    if (removeButton) {

      cart =
        cart.filter(
          product =>
            product.key !==
            removeButton.dataset.remove
        );


      save();

    }

  }
);


/* ========================================
   PRODUCT MODAL
======================================== */

$('#modalClose').onclick =
  closeModal;


$('#productModal').addEventListener(
  'click',
  event => {

    if (
      event.target.id ===
      'productModal'
    ) {

      closeModal();

    }


    const sizeButton =
      event.target.closest(
        '[data-size]'
      );


    const colorButton =
      event.target.closest(
        '[data-color]'
      );


    if (sizeButton) {

      selectedSize =
        sizeButton.dataset.size;


      $$('[data-size]')
        .forEach(button =>
          button.classList.remove(
            'active'
          )
        );


      sizeButton.classList.add(
        'active'
      );

    }


    if (colorButton) {

      selectedColor =
        colorButton.dataset.color;


      $$('[data-color]')
        .forEach(button =>
          button.classList.remove(
            'active'
          )
        );


      colorButton.classList.add(
        'active'
      );

    }

  }
);


$('#modalAdd').onclick =
  () => {

    if (!selected) return;


    addToCart(
      selected.id,
      selectedSize,
      selectedColor
    );


    closeModal();

  };


/* ========================================
   SEARCH
======================================== */

$('#searchBtn').onclick =
  () => {

    $('#searchPanel')
      .classList
      .add('open');

    $('#searchInput')
      .focus();

  };


$('#searchClose').onclick =
  () =>
    $('#searchPanel')
      .classList
      .remove('open');


$('#searchInput').addEventListener(
  'input',
  event =>
    renderSearch(
      event.target.value
    )
);


$('#searchResults').addEventListener(
  'click',
  event => {

    const result =
      event.target.closest(
        '[data-search-id]'
      );


    if (!result) return;


    $('#searchPanel')
      .classList
      .remove('open');


    openProduct(
      Number(
        result.dataset.searchId
      )
    );

  }
);


/* ========================================
   MOBILE MENU
======================================== */

$('#menuBtn').onclick =
  () =>
    $('#mobileNav')
      .classList
      .toggle('open');


$$('#mobileNav a')
  .forEach(link => {

    link.onclick =
      () =>
        $('#mobileNav')
          .classList
          .remove('open');

  });


/* ========================================
   NEWSLETTER
======================================== */

$('#newsletter').addEventListener(
  'submit',
  event => {

    event.preventDefault();

    toast(
      'Welcome to ZAVARO.'
    );

    event.target.reset();

  }
);


/* ========================================
   HEADER SCROLL
======================================== */

window.addEventListener(
  'scroll',
  () => {

    $('#header')
      .classList
      .toggle(
        'scrolled',
        window.scrollY > 20
      );

  }
);


/* ========================================
   ESCAPE KEY
======================================== */

document.addEventListener(
  'keydown',
  event => {

    if (
      event.key !== 'Escape'
    ) {
      return;
    }


    closeBag();

    closeModal();

    closeCheckout();

    closeSuccess();


    $('#searchPanel')
      .classList
      .remove('open');


    $('#mobileNav')
      .classList
      .remove('open');

  }
);