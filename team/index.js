const team = {
	'Johnny': 'johnny',
	'Tomomi': 'tomomi'
}

const names = Object.keys(team)
	.map(k => (
		{k, sort: Math.random()}
	))
	.sort((a, b) => a.sort - b.sort)
	.map(({k}) => k);

const add_team = (team_member) => {
	const b = document.getElementById('product_insertion');
	const p = b.parentNode;

	const ps = document.createElement('a');

	ps.innerHTML += `
		<div class="polaroid_stack">
			<div class="polaroid_border">
				<img class="polaroid" src="portraits/${team[team_member]}.AVIF" />
				<span class="shirt_name shirt_name_default_margin">
					${team_member}
				</span>
			</div>
		</div>
	`

	ps.href = team[team_member];

	p.insertBefore(ps, b);
}

names.map(n => {
	add_team(n);
});

const add_visual_elements = () => {
	const product_polaroids = [...document.getElementsByClassName('polaroid_stack')];

	const product_row = document.getElementById('product_row');

	product_polaroids.map((e) => {
		e.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
	});
};

add_visual_elements();