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
		e.style.zIndex = 100;
		//product_info.style.opacity = 1;

		let k = 0;
		product_polaroids.map((other) => {
			if(other !== e){
				other.classList.add('blur');
				other.style.transform = `rotate(${rotations[k]}deg)`;
				[...other.children].map((ec) => {
					ec.style.transform = `rotate(0deg)`;
				});
				other.style.zIndex = 5;
			}
			k++;
		});

		e.classList.remove('blur');
		e.style.transform = `rotate(0deg)`;

		let r = 0;
		[...e.children].reverse().map((ec) => {
			ec.style.transform = `rotate(${r++ * 10}deg)`;
		});

		const offset = window.screen.width >= 500 ? 50 : -10;

		product_row.scrollTo({
			left: e.getBoundingClientRect().left + product_row.scrollLeft - offset,
			top: 0,
			behavior: 'smooth'
		});
	});

	rotations[i] = Math.random() * 30 - 15;

	e.style.transform = `rotate(${rotations[i]}deg)`;

	i++;
})

product_row.scrollTo({
	left: product_polaroids[0].getBoundingClientRect().left + product_row.scrollLeft - 50,
	top: 0,
	behavior: 'smooth'
});