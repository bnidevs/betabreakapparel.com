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
})

// product_row.addEventListener('scroll', () => {
// 	if(selected === null) {
// 		return;
// 	}

// 	let k = 0;
// 	product_polaroids.map((o) => {
// 		o.classList.remove('blur');
// 		o.style.transform = `rotate(${rotations[k]}deg)`;
// 		[...o.children].map((ec) => {
// 			ec.style.transform = `rotate(0deg)`;
// 		});
// 		o.style.zIndex = 15;
// 		k++;
// 	});
// 	size_selector.style.opacity = 0;
// 	selected = null;
// });

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
  		}, 1500)
	});
});