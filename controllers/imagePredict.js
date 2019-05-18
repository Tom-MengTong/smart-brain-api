
const handleImagePredict = (req, res, Clarifai) => {
	const app = new Clarifai.App({apiKey: '923f46a9870a4775829b072e8e7a5221'});

	app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.imgUrl)
	.then(response => res.json(response))
	.catch(err => res.status(400).json('unable to work with api'));
}

module.exports = {
	handleImagePredict: handleImagePredict
}