import UniversalFunctions from "../../utils/universalFunctions.js";
import Joi from "joi";
import Controller from "../../controllers/index.js";
const Config = UniversalFunctions.CONFIG;

const increaseCountRoute = {
	method: "POST",
	path: "/api/demo/increase_counter",
	options: {
		description: "demo api",
		tags: ["api"],
		handler: function (request, h) {
			var payloadData = request.payload;
			Controller.increaseCountController(payloadData);
			return UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, {});
		},
		validate: {
			payload: Joi.object({
				jobID: Joi.string(),
				datashopServerAddress: Joi.string(),
				dataFileURL: Joi.object({
					url: Joi.any(),
					json: Joi.object(
						{}
					),
				}),
			}).label("Demo Model"),
			failAction: UniversalFunctions.failActionFunction,
		},
		plugins: {
			"hapi-swagger": {
				responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages,
			},
		},
	},
};

const decreaseCountRoute = {
	method: "POST",
	path: "/api/demo/decrease_counter",
	options: {
		description: "demo api",
		tags: ["api"],
		handler: function (request, h) {
			var payloadData = request.payload;
			Controller.decreaseCountController(payloadData);
			return UniversalFunctions.sendSuccess(Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, {});
		},
		validate: {
			payload: Joi.object({
				jobID: Joi.string(),
				datashopServerAddress: Joi.string(),
				dataFileURL: Joi.object({
					url: Joi.any(),
					json: Joi.object(
						{}
					),
				}),
			}).label("Demo Model"),
			failAction: UniversalFunctions.failActionFunction,
		},
		plugins: {
			"hapi-swagger": {
				responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages,
			},
		},
	},
};

export default [
	increaseCountRoute,
	decreaseCountRoute
];
