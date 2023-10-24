import axios from 'axios';
import { url } from '../Store/store';

const $api = axios.create({
    withCredentials: true,
    baseURL: url
})

export default $api;