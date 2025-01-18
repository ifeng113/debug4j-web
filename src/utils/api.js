import httpRequest from './httpRequest.js';

const api = {

    getClients: () => httpRequest.get('/manage/clients'),

    getProxy: (data) => httpRequest.get('/proxy/details?clientSessionId=' + data),
    addProxy: (data) => httpRequest.post('/proxy', data),
    removeProxy: (data) => httpRequest.post('/proxy/remove', data),

    getLog: (data) => httpRequest.post('/attach/task', data),
    addLog: (data) => httpRequest.post('/attach/task/open', data),
    deleteLog: (data) => httpRequest.post('/attach/task/close', data),

    ping: (data) => httpRequest.post('/attach/ping', data),
    getCodeClass: (data) => httpRequest.post('/attach/class', data),

    getSource: (data) => httpRequest.post('/attach/source', data),
    sourceUpdate: (data) => httpRequest.post('/attach/reload/source', data),
    sourceByteUpdate: (data) => httpRequest.post('/attach/reload/class', data, {headers: {'Content-Type': 'multipart/form-data'}}),
    sourceRestore: (data) => httpRequest.post('/attach/restore', data),

    sourceLineLoad: (data) => httpRequest.post('/attach/source/method-line', data),
    sourceLinePatch: (data) => httpRequest.post('/attach/patch/method-line', data),
}

export default api