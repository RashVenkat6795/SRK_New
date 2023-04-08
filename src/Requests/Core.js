import axios from 'axios';
import { Alert } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { Config } from '@/Config'
import { useSelector } from 'react-redux';

const Request = async function (options, isHeader = true) {
	console.log("company options....", options)
	// let company = useSelector(state => state.user.activeCompany);

	const client = axios.create({
		// baseURL: Config.API_URL,
		// baseURL: `http://eibs.elysiumproduct.com/${options.data.company}/services/`,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
	});

	const onSuccess = function (response) {
		console.log('Request Successful!', response);
		return response.data;

		// const jsonText = JSON.stringify(response.data);
		// const objResponse = JSON.parse(jsonText);
		// console.log(objResponse);
		// return objResponse;

	};

	const onError = function (error) {
		console.debug('Request Failed:', error.config);
		console.log('Request error:', error);

		if (error.response) {
			console.debug('Status:', error.response.status);
			console.debug('Data:', error.response.data);
			console.debug('Headers:', error.response.headers);
		} else {
			Alert.alert("Error", error.message, [{ text: "OK", onPress: () => {} }]);
			console.debug('Error Message:', error.message);
		}

		return Promise.reject(error.response || error.message);
	};

    return client(options).then(onSuccess).catch(onError);
	// return NetInfo.fetch().then(state=> {
	// 	if (state.isConnected) {
	// 		return client(options).then(onSuccess).catch(onError);
	// 	} else {
	// 		// BottomAlert("You are not connected to internet.");
	// 		console.warn("You are not connected to internet.")
	// 	}
	// });
};

export default Request;
