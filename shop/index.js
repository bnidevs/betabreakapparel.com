const product_polaroids = [...document.getElementsByClassName('polaroid_stack')];
const rotations = [];
const product_info = document.getElementById('product_info');

const product_row = document.getElementById('product_row');

let selected = null;

let i = 0;
product_polaroids.map((e) => {
	e.addEventListener('click', () => {

		if(e === selected){
			e.insertBefore([...e.children].pop(), e.children[0]);

			return;
		}

		selected = e;
		e.style.zIndex = 150;
		//product_info.style.opacity = 1;

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
		[...e.children].reverse().map((ec) => {
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
	});

	rotations[i] = Math.random() * 30 - 15;

	e.style.transform = `rotate(${rotations[i]}deg)`;

	i++;
})

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