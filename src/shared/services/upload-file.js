import * as axios from 'axios';
import { BASE_URL } from '../constants/app.constants';

function upload(formData) {
    const url = `${BASE_URL}/upload`;
    return axios.post(url, formData)
}

export { upload }