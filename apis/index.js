import request from '../utils/request';

function getVideoList(type, page) {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/mpvideo/list/'+type+'?page='+page).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

// 详情页获取上下文,上1下2
function getVideoDetail(type, vid) {
    return new Promise((resolve, reject) => {
        request.request('GET', 'V1/mpvideo/detail/'+type+'/'+vid).then(res => {
            resolve(res.data)
        }).catch(e => {
            reject(e)
        })
    })
}

export {
    getVideoList, getVideoDetail
}
