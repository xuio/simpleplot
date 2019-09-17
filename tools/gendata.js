function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

setInterval(() => {
	console.log(JSON.stringify([
		getRandomArbitrary(0, 200),
		getRandomArbitrary(-100, 100),
		getRandomArbitrary(-20, 20),
	]));
}, 100);
