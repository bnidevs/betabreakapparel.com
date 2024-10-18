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