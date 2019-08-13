import eventBus from './event-bus';
import { ALERT_EVENT } from '../constants/app.constants';

function displayAlert(color, msg, timeout) {
    const data = {
        color,
        msg,
        timeout
    };
    eventBus.$emit(ALERT_EVENT, data);
}

export default displayAlert;