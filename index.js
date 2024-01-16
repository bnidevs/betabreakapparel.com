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

const mobile_pics = document.getElementsByClassName('mobile_pic');

const desktop_pics = document.getElementsByClassName('desktop_pic');

showi(mobile_pics, t);
showi(desktop_pics, t);

setInterval(() => {
	t++;
	showi(mobile_pics, t);
	showi(desktop_pics, t);
}, 8000);