import * as axios from 'axios';
import { BASE_URL } from '../constants/app.constants';

function fetchData(payload) {
    const url = `${BASE_URL}/fetch`;
    return axios.post(url, payload)
}

export { fetchData }