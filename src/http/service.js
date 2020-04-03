
import axios from 'axios';
// axios.defaults.headers.common['X-Token'] = window.localStorage.token;
var headers ={
    "Content-Type": "application/json;charset=UTF-8",
    // "Access-Token": window.localStorage.getItem('token') ? window.localStorage.getItem('token') : "",
    // "ApiKey":"a53337f7a2a277458b3689193de2ff85"
};
var serivce = {
    get: function (url, params, callback) {
        var req = {
            url: url,
            method: "get",
            params: params,
            headers: headers
        }
        axios.request(req).then(res => {
            return callback(res.data);
        });
    }

    , post: function (url, params, callback) {
        axios.request({
            url: url,
            method: "post",
            data: params,
            headers: headers
        }).then(res => {
            return callback(res.data);
        });
    }
    , data: function (url, pramas) {
        return axios.request({
            url: url,
            method: "post",
            data: pramas,
            headers: headers
        })
    }
}

export default serivce;
