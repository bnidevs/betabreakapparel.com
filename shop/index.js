const add_visual_elements = () => {
	const product_polaroids = [...document.getElementsByClassName('polaroid_stack')];
	const rotations = [];

	const product_row = document.getElementById('product_row');

	let selected = null;

	let i = 0;
	product_polaroids.map((e) => {
		e.addEventListener('click', () => {

			if(e === selected){
				e.insertBefore([...e.children].filter(
					(c) => c.classList.contains('polaroid_border')
				).pop(), e.children[0]);

				return;
			}

			e.style.zIndex = 150;
			const active_size_selector = e.getElementsByClassName('size_selector')[0];
			[...document.getElementsByClassName('size_selector')].map((ss) => {
				if(ss === active_size_selector) {
					return;
				}
				ss.style.opacity = 0;
				setTimeout(() => {
					ss.classList.add('hidden');
				}, 200)
			});
			active_size_selector.classList.remove('hidden');
			active_size_selector.style.opacity = 1;

			let k = 0;
			product_polaroids.map((other) => {
				if(other !== e){
					other.classList.add('blur');
					other.style.transform = `rotate(${rotations[k]}deg)`;
					[...other.children].map((ec) => {
						ec.style.transform = `rotate(0deg)`;
					});

					while(!other.children[0].classList.contains('stack_bottom')){
						other.insertBefore([...other.children].filter(
							(c) => c.classList.contains('polaroid_border')
						).pop(), other.children[0]);
					}

					other.style.zIndex = 15;
				}
				k++;
			});

			e.classList.remove('blur');
			e.style.transform = `rotate(0deg)`;

			let r = 0;
			[...e.children].filter(
				(c) => c.classList.contains('polaroid_border')
			).reverse().map((ec) => {
				ec.style.transform = `rotate(${r++ * 10}deg)`;
			});

			if (window.screen.width >= 500) {
				product_row.scrollTo({
					left: e.getBoundingClientRect().left + product_row.scrollLeft - 50,
					top: 0,
					behavior: 'smooth'
				});
			} else {
				product_row.scrollBy({
					left: e.getBoundingClientRect().left - (window.innerWidth - e.getBoundingClientRect().width) / 2.0 + 10,
					top: 0,
					behavior: 'smooth'
				});
			}

			selected = e;
		});

		rotations[i] = Math.random() * 30 - 15;

		e.style.transform = `rotate(${rotations[i]}deg)`;

		i++;
	});

	if (window.screen.width >= 500) {
		product_row.scrollTo({
			left: product_polaroids[0].getBoundingClientRect().left + product_row.scrollLeft - 50,
			top: 0,
			behavior: 'smooth'
		});
	} else {
		product_row.scrollBy({
			left: product_polaroids[0].getBoundingClientRect().left - (window.innerWidth - product_polaroids[0].getBoundingClientRect().width) / 2.0 + 10,
			top: 0,
			behavior: 'smooth'
		});
	}

	const cart_container = document.getElementById('cart_container');
	const cart_positions = {
		ONSCREEN: 'translate(0,0)',
		OFFSCREEN: 'translate(100%, 0)'
	};
	const cart_close = document.getElementById('cart_close');
	const cart_btn = document.getElementById('cart_btn');
	cart_btn.addEventListener('click', () => {
			cart_container.style.transform = cart_positions.ONSCREEN;
			cart_close.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
			cart_close.style.backdropFilter = 'blur(10px)';
		}
	);
	cart_close.addEventListener('click', () => {
			cart_container.style.transform = cart_positions.OFFSCREEN;
			cart_close.style.backgroundColor = 'transparent';
			cart_close.style.backdropFilter = 'none';
		}
	);

	const size_btns = [...document.getElementsByClassName('size_btn')];
	size_btns.map((b) => {
		b.addEventListener('click', (e) => {
			e.stopPropagation();
			const popcorn = document.createElement('p');
	  		const plus_one_text = document.createTextNode('+1');
			popcorn.classList.add('plus_one');
			popcorn.appendChild(plus_one_text);
			document.body.appendChild(popcorn);
			popcorn.style.left = `${e.x}px`;
	  		popcorn.style.top = `${e.y - 80}px`;
	  		setTimeout(() => {
	  			popcorn.remove();
	  		}, 1450)
		});
	});
};

// == SHOPIFY INTEGRATION ==

const available_products = [
	'gid://shopify/Product/8888929648888', // lo grav
	'gid://shopify/Product/8888929878264', // beta breaker
	'gid://shopify/Product/8888930042104', // sloth
	'gid://shopify/Product/8888932073720', // send train
	'gid://shopify/Product/8933142397176', // got chalk
	'gid://shopify/Product/8936088862968', // hold tight
	'gid://shopify/Product/8936172060920', // ascension
	'gid://shopify/Product/8896115704056', // low grav holo
	'gid://shopify/Product/9024132776184', // quickdraw
	'gid://shopify/Product/9024137789688', // flowy
];

const storefront_public_token = '01386fc29bc8aff76b8d48e7d3db84e5';
const storefront_url = 'https://betabreakapparel.myshopify.com/api/2024-10/graphql.json';
let cart_id = window.localStorage.getItem('cartid');
let checkout_url = '';
let subtotal = 0;
let item_count = 0;

const wrap_gql = (query) => {
	return {
		'async': true,
		'crossDomain': true,
		'method': 'POST',
		'headers': {
			'X-Shopify-Storefront-Access-Token': storefront_public_token,
			'Content-Type': 'application/graphql',
		},
		'body': query
	}
};

const cart_quantities = {};

const cart_list = document.getElementById('cart_list');
const cart_subtotal = document.getElementById('cart_subtotal');
const checkout_link = document.getElementById('checkout_link');
const cart_empty_text = document.getElementById('cart_empty');
const cart_footer = document.getElementById('cart_footer');
const cart_counter = document.getElementById('cart_btn_counter');
const update_cart_visual = (lines) => {
	if(lines.length == 0) {
		cart_list.innerHTML = '';
		cart_counter.innerText = '';
		cart_empty_text.style.display = 'block';
		cart_footer.style.display = 'none';
		return;
	}

	cart_empty_text.style.display = 'none';
	cart_footer.style.display = 'flex';

	cart_list.innerHTML = '';
	cart_counter.innerText = item_count.toString();

	lines.map((item) => {
		cart_list.innerHTML += `
				<div class="cart_item">
					<img src="${item['merchandise']['image']['src']}" class="cart_item_thumb">
					<div class="cart_item_info">
						<span class="cart_item_name">
							${item['merchandise']['product']['title']}
						</span>
						<span class="cart_item_size">
							size: ${item['merchandise']['title']}
						</span>
						<div class="row">
							<div class="row">
								<button type="button" class="cart_item_quantity_btn minus" line="${item['id']}">
									<svg viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
									  	<rect width="90%" height="30%" x="5%" y="35%" fill="white" />
									</svg>
								</button>
								<div class="cart_item_quantity">
									${item['quantity']}
								</div>
								<button type="button" class="cart_item_quantity_btn plus" line="${item['id']}">
									<svg viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
									  	<rect width="90%" height="30%" x="5%" y="35%" fill="white" />
									  	<rect width="30%" height="90%" x="35%" y="5%" fill="white" />
									</svg>
								</button>
							</div>
							<span class="cart_item_total">
								$${parseInt(item['cost']['subtotalAmount']['amount'])}
							</span>
						</div>
					</div>
				</div>`;

		cart_quantities[item['id']] = parseInt(item['quantity']);
	});

	cart_subtotal.innerText = `Total: $${parseInt(subtotal)}`;

	checkout_link.href = checkout_url;

	[...document.getElementsByClassName('cart_item_quantity_btn')].map((b) => {
		b.addEventListener('click', increment_item);
	});
}

const get_product_gql = (product_id) => `
query Product {
    product(id: "${product_id}") {
        title
		description
		productType
        media(first: 3) {
            nodes {
                ... on MediaImage {
                    image {
                        src
                    }
                }
            }
        }
        variants(first: 10) {
            nodes {
                title
                id
                availableForSale
            }
        }
    }
}
`;

const add_to_cart_gql = (variant_id) => `
mutation CartLinesAdd {
    cartLinesAdd(
        cartId: "${cart_id}"
        lines: {
            quantity: 1
            merchandiseId: "${variant_id}"
        }
    ) {
        cart {
            checkoutUrl
            id
			totalQuantity
            cost {
                subtotalAmount {
                    amount
                }
            }
	        lines(first: 20) {
	            nodes {
					id
	                merchandise {
	                    ... on ProductVariant {
	                        title
	                        product {
	                            title
	                        }
	                        image {
	                            src
	                        }
	                    }
	                }
	                quantity
	                ... on CartLine {
	                    cost {
	                        subtotalAmount {
	                            amount
	                        }
	                    }
	                }
	            }
	        }
        }
    }
}`;

const update_cart_gql = (line_id, amount_change) => `
mutation CartLinesUpdate {
    cartLinesUpdate(
        cartId: "${cart_id}"
        lines: {
            quantity: ${cart_quantities[line_id] + amount_change}
            id: "${line_id}"
        }
    ) {
    	cart {
	        id
	        checkoutUrl
			totalQuantity
	        cost {
	            subtotalAmount {
	                amount
	            }
	        }
	        lines(first: 20) {
	            nodes {
					id
	                merchandise {
	                    ... on ProductVariant {
	                        title
	                        product {
	                            title
	                        }
	                        image {
	                            src
	                        }
	                    }
	                }
	                quantity
	                ... on CartLine {
	                    cost {
	                        subtotalAmount {
	                            amount
	                        }
	                    }
	                }
	            }
	        }
		}
    }
}`;

const increment_item = (e) => {
	let amount_change = -1;

	if(e.currentTarget.classList.contains('plus')) {
		amount_change = 1;
	}

	fetch(
		storefront_url, 
		wrap_gql(
			update_cart_gql(
				e.currentTarget.getAttribute('line'),
				amount_change
			)
		)
	)
	    .then(res => res.json())
	    .then(data => data['data']['cartLinesUpdate']['cart'])
	    .then(data => {
	    	cart_id = data['id'];
			checkout_url = data['checkoutUrl'];
	    	subtotal = data['cost']['subtotalAmount']['amount'];
	    	item_count = data['totalQuantity'];
	    	update_cart_visual(data['lines']['nodes']);
	    });
}

const link_buttons_to_items = () => {
	[...document.getElementsByClassName('size_btn')].map((b) => {
		b.addEventListener('click', () => {
			fetch(
				storefront_url, 
				wrap_gql(
					add_to_cart_gql(
						b.getAttribute('variant_id')
					)
				)
			)
			    .then(res => res.json())
			    .then(data => data['data']['cartLinesAdd']['cart'])
			    .then(data => {
			    	cart_id = data['id'];
	    			checkout_url = data['checkoutUrl'];
	    			subtotal = data['cost']['subtotalAmount']['amount'];
	    			item_count = data['totalQuantity'];
			    	update_cart_visual(data['lines']['nodes']);
			    });
		});
	});
}

const type_to_edition_map = {
	'Holographic Edition': 'holographic',
	'Artist Edition': 'artist',
	'Blank Edition': 'blank'
}

const add_product = (product_data) => {
	const b = document.getElementById('product_insertion');
	const p = b.parentNode;

	const ps = document.createElement('div');
	ps.classList.add('polaroid_stack');

	const sizing_note = product_data['description'];
	if(product_data['description'] !== '') {
		ps.innerHTML = `
			<div class="sizing_note polaroid_border stack_bottom">
				<div class="polaroid spillover">
					<div class="sizing_note_text_placeholder">
						${sizing_note}
					</div>
				</div>
				<span class="shirt_name white_out">
					${product_data['title']}
				</span>
				<div class="sizing_note_text">
					${sizing_note}
				</div>
			</div>
		`
	}

	let edition_text = '';
	const productType = product_data['productType'];
	if(productType !== '') {
		edition_text = `
			<span class="shirt_edition ${type_to_edition_map[productType]}">
				${productType}
			</span>
		`
	}

	ps.innerHTML += product_data['media']['nodes'].map((img) => `
		<div class="polaroid_border">
			<img class="polaroid" src="${img['image']['src']}" />
			<span class="shirt_name ${productType === '' ? 'shirt_name_default_margin' : 'shirt_name_with_edition'}">
				${product_data['title']}
			</span>
			${edition_text}
		</div>
	`).join('');

	ps.innerHTML += `
		<div class="size_selector hidden">
	` + 
	product_data['variants']['nodes'].map((variant) => !variant['availableForSale'] ? '' : `
		<button type="button" class="size_btn" variant_id="${variant['id']}">
			${variant['title']}
		</button>
	`).join('') + 
	`
		</div>
	`;

	p.insertBefore(ps, b);
}

Promise.all(
	available_products.map((product_id) => 
		fetch(
			storefront_url, 
			wrap_gql(
				get_product_gql(
					product_id
				)
			)
		)
	    .then(res => res.json())
    	.then(data => data['data']['product'])
	    .then(data => {
	    	add_product(data);
	    })
	)
)
	.then(add_visual_elements)
	.then(link_buttons_to_items);

const init_cart_gql = `
mutation CartCreate {
    cartCreate(input: { lines: null }) {
        cart {
            id
        }
    }
}`;

const get_cart_gql = `
query Cart {
    cart(
        id: "${cart_id}"
    ) {
        id
        checkoutUrl
		totalQuantity
        cost {
            subtotalAmount {
                amount
            }
        }
        lines(first: 20) {
            nodes {
				id
                merchandise {
                    ... on ProductVariant {
                        title
                        product {
                            title
                        }
                        image {
                            src
                        }
                    }
                }
                quantity
                ... on CartLine {
                    cost {
                        subtotalAmount {
                            amount
                        }
                    }
                }
            }
        }
    }
}
`

// create cart

if(cart_id == null) {
	fetch(storefront_url, wrap_gql(init_cart_gql))
	    .then(res => res.json())
    	.then(data => data['data']['cartCreate']['cart'])
	    .then(data => {
	    	cart_id = data['id'];
	    	window.localStorage.setItem('cartid', cart_id);
	    });
}

// sanity check

fetch(storefront_url, wrap_gql(get_cart_gql))
    .then(res => res.json())
    .then(data => data['data']['cart'])
    .then(data => {
    	cart_id = data['id'];
    	checkout_url = data['checkoutUrl'];
	    subtotal = data['cost']['subtotalAmount']['amount'];
	    item_count = data['totalQuantity'];
    	update_cart_visual(data['lines']['nodes']);
    });