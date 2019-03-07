class ErrorHandler {
	constructor(kongou) {
		this.kongou = kongou;
	};

	fire(error) {
		const errored = error.stack || error;
		console.error(errored);
		// Some More Handler in future
	};
}

module.exports = ErrorHandler;