import request from '../utils/request';

function getVideoListr(type, page) {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/mpvideo/list/'+type+'?page='+page).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

export {
    getVideoListr
}
