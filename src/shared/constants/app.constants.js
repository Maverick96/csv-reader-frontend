const columns = [{
    value: 'data',
    text: 'Data'
},
{
    value: 'forecast',
    text: 'Forecast'
}]
const BASE_URL = process.env.VUE_APP_ROOT_URL;

const ALERT_EVENT = "ALERT_EVENT";

const MAX_FILE_SIZE = process.env.VUE_APP_MAX_FILE_SIZE;
export { columns, BASE_URL, ALERT_EVENT, MAX_FILE_SIZE };