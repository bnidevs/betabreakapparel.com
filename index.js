let t = 0;

const showi = (l, i) => {
	let x = 0;
	i = i % l.length;
	[...l].map(e => {
		if(i == x){
			e.classList.add('disp');
		}else{
			e.classList.remove('disp');
		}
		x++;
	})
}

const pics = document.getElementsByClassName('pic');

showi(pics, t);

setInterval(() => {
	t++;
	showi(pics, t);
}, 8000);

let show_links = false;

document.getElementById('burger').addEventListener('click', () => {
	const link_elements = [...document.getElementsByClassName('links')];
	console.log(link_elements);
	show_links = !show_links;
	if(show_links){
		link_elements.map((e) => {
			e.classList.add('disp');
		});
	}else{
		link_elements.map((e) => {
			e.classList.remove('disp');
		});
	}
});

document.addEventListener("touchstart", function() {}, true);