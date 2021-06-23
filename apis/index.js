import http from './interface'

/**
 * 将业务所有接口统一起来便于维护
 * 如果项目很大可以将 url 独立成文件，接口分成不同的模块
 * 
 */

/**
 * 瀑布流页获取视频
 * @param {Number} page 页码
 * @param {Number} limit 条数
 * */
export const getVideoInfos = (data) => {
    return http.request({
        url: '/http/getVideoInfos',
        method: 'GET', 
        data,
    })
}

/**
 * 短视频页获取视频
 * @param {Number} vId 视频id(不传则从数据库第一个视频开始)
 * @param {Number} type 1 向上加载 2 向下加载
 * */
export const getVideoList = (data) => {
    return http.request({
        url: '/http/getVideoList',
        method: 'GET', 
        data,
    })
}

/**
 * 更新是否喜欢视频
 * @param {String}  uId 用户id  
 * @param {String}  vId 视频id  
 * @param {Boolean}  status 修改的状态
 * */
export const updateVideoLike = (data) => {
    return http.request({
        url: '/http/updateVideoLike',
        method: 'POST', 
        data,
    })
}

/**
 * 获取视频评论
 * @param {Number} page 页码
 * @param {Number} limit 条数
 * */
export const getCommentList = (data) => {
    return http.request({
        url: '/http/getCommentList',
        method: 'GET', 
        data,
    })
}


/**
 * 发表评论
 * @param {String} avatarUrl 头像URL
 * @param {String} name 名字也是用户id
 * @param {String} msg 评论的消息
 * @param {Number} vId 视频的id
 * */
export const addComment = (data) => {
    return http.request({
        url: '/http/addComment',
        method: 'POST', 
        data,
    })
}