import httpRequest from './httpRequest.js';

const api = {

    getClients: (data) => httpRequest.get('/manage/clients', data),
}

export default api