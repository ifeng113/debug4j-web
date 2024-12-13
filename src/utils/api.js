import httpRequest from './httpRequest.js';

const api = {

    getClients: () => httpRequest.get('/manage/clients'),

    getProxy: (data) => httpRequest.get('/proxy/details?clientSessionId=' + data),
    addProxy: (data) => httpRequest.post('/proxy', data),

    getLog: (data) => httpRequest.post('/attach/task', data),
    addLog: (data) => httpRequest.post('/attach/task/open', data),
    deleteLog: (data) => httpRequest.post('/attach/task/close', data),

    getCodeClass: (data) => httpRequest.post('/attach/class', data),
}

export default api