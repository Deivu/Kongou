class ErrorHandler {
	constructor(kongou, error) {
		this.errored = error.stack || error;
		this.kongou = kongou;
	};

	fire() {
		console.error(this.errored);
		// Some More Handler in future
	};
};

module.exports = ErrorHandler;