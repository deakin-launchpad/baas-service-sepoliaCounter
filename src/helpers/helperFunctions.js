import axios from "axios";

/**
 * @param {Object} payloadData
 * @param {Object} data
 * @param {Callback} callback
 */
export const respondToServer = (payloadData, data, callback) => {
	console.log("=== RESPOND TO SERVER ===");
	let service = payloadData;
	let destination = service.datashopServerAddress + "/api/job/updateJob";
	let lambdaInput;
	if (data) {
		lambdaInput = {
			insightFileURL: service.dataFileURL,
			jobid: service.jobID,
			returnData: data,
		};
	} else {
		lambdaInput = {
			insightFileURL: "N/A", // failed job status
			jobid: service.jobID,
		};
	}
	axios
		.put(destination, lambdaInput)
		.then((res) => {
			callback(null, "Job responded");
		})
		.catch((e) => {
			callback(e, null);
		});
};

