//components
import Home from '../components/Home.vue';
import FileUpload from '../components/FileUpload.vue';

const routes = [
    { path: '/', redirect: '/home' }, // default route
    { path: '/home', component: Home },
    { path: '/upload', component: FileUpload },
]
export default routes;