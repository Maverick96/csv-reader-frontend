import * as axios from 'axios';
import { BASE_URL } from '../constants/app.constants';

function listFiles() {
    const url = `${BASE_URL}/list-files`;
    return axios.get(url)
}

export { listFiles }