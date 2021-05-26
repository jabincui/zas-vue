const axios = require("axios").default;
//const baseurl = "https://oneapp.2linkq.com/zas";
const baseurl = "http://10.128.249.37:8925";

axios.interceptors.request.use(function (config) {
  if(localStorage.token){
    config.headers['Authorization'] = localStorage.token
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

function handleError(error, fail){
  if (error.msg){
    fail(`被后台积极拒绝，原因：${error.msg}，请F12检查console并发给管理员YZ。`)
    console.log(error.response)
  } else if (error.response) {
    fail(`未正确加载，状态码${error.response.status}，请F12检查console并发给管理员CZB。`)
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    fail(`请求发送失败，请F12检查console并发给管理员YZ。`)
    console.log(error.request);
  } else {
    fail(`网络错误，请重试。`)
    console.log('Error', error.message);
  }
}

export function getAllMicroservice(success) {
  axios
    .get(`${baseurl}/microservice/all`)
    .then(function(response) {
      success(response.data)
    })
    .catch(error => handleError(error, msg => console.error(msg)))
    .then(function() {
      // 总是会执行
    });
}

export function getMSNameByID(msid, success, fail){
  axios
  .get(`${baseurl}/microservice/by/id/${msid}`)
  .then(function(response) {
    success(response.data.obj.name)
  })
  .catch(error => handleError(error, fail));
}

export function getRoleByID(msid, success, fail){
  axios
  .get(`${baseurl}/role/by/${msid}`)
  .then(function(response) {
    success(response.data.obj)
  })
  .catch(error => handleError(error, fail));
}

export function getURLByID(msid, success, fail){
  axios
  .get(`${baseurl}/url/by/${msid}`)
  .then(function(response) {
    success(response.data.obj)
  })
  .catch(error => handleError(error, fail));
}

export function getRoleURLTable(msid, success, fail){
  axios.all([
    axios.get(`${baseurl}/role/by/${msid}`),
    axios.get(`${baseurl}/url/by/${msid}`),
    axios.get(`${baseurl}/authority/by/${msid}`),
  ])
  .then(axios.spread(function(role, url, auth){
    var roleList = role.data.obj;
    for (var i = 0; i < roleList.length; i++) {
      if (roleList[i].id.substring(0,2) === 'pa') {
        const r = roleList.splice(i, 1);
        r[0].edit = 'disable';
        roleList.unshift(r[0]);
        break;
      }
    }
    const urlList = url.data.obj;
    const authList = auth.data.obj;
    const resTable = urlList.map(uitem => {
      var row = {name: uitem};
      roleList.map(ritem => {
        const auth = authList.find(aitem => {return uitem.id === aitem.urlId && ritem.id === aitem.roleId})
        row[ritem.id] = {value: auth !== undefined}
        row[ritem.id].auth = row[ritem.id].value ? auth : {urlId: uitem.id, roleId: ritem.id}
      })
      return row
    });
    success({first: roleList, second: resTable})
  }))
  .catch(error => handleError(error, fail));
}

export function roleNameChange(roleId, name, success, fail){
  axios.post(`${baseurl}/role/update`, {id: roleId, name: name})
  .then(function(response){
    if(response.data === "PASS"){
      success(`角色名${name}已保存`)
    }else{
      throw {msg: response.data, response: response}
    }
  })
  .catch(error => handleError(error, fail))
}

export function roleDel(roleId, name, success, fail){
  axios.post(`${baseurl}/role/delete`, roleId, {headers: {'Content-Type': 'application/json'}})
  .then(function(response){
    if(response.data === "PASS"){
      success(`角色${name}已删除`)
    }else{
      throw {msg: response.data, response: response}
    }
  })
  .catch(error => handleError(error, fail))
}

export function roleAdd(msId, name, success, fail){
  axios.post(`${baseurl}/role`, {msId: msId, name: name})
  .then(function(response){
    if(response.data.result === "PASS"){
      success(`角色${name}已添加`)
    }else{
      throw {msg: response.data, response: response}
    }
  })
  .catch(error => handleError(error, fail))
}

export function urlNameChange(urlId, path, success, fail){
  axios.post(`${baseurl}/url/update`, {id: urlId, path: path})
  .then(function(response){
    if(response.data === "PASS"){
      success(`路径${path}已保存`)
    }else{
      throw {msg: response.data, response: response}
    }
  })
  .catch(error => handleError(error, fail))
}

export function urlDel(urlId, path, success, fail){
  axios.post(`${baseurl}/url/delete`, urlId, {headers: {'Content-Type': 'application/json'}})
  .then(function(response){
    if(response.data === "PASS"){
      success(`路径${path}已删除`)
    }else{
      throw {msg: response.data, response: response}
    }
  })
  .catch(error => handleError(error, fail))
}

export function urlAdd(msId, path, success, fail){
  axios.post(`${baseurl}/url`, {msId: msId, path: path})
  .then(function(response){
    if(response.data.result === "PASS"){
      success(`路径${path}已添加`)
    }else{
      throw {msg: response.data, response: response}
    }
  })
  .catch(error => handleError(error, fail))
}

export function authAdd(msId, urlId, roleId, success, fail){
  axios.post(`${baseurl}/authority`, {msId: msId, urlId: urlId, roleId: roleId})
  .then(function(response){
    if(response.data.result === "PASS"){
      success(response.data.obj.id)
    }else{
      throw {msg: response.data, response: response}
    }
  })
  .catch(error => handleError(error, fail))
}

export function authDel(authId, fail){
  axios.post(`${baseurl}/authority/delete`, authId, {headers: {'Content-Type': 'application/json'}})
  .then(function(response){
    if(response.data !== "PASS"){
      throw {msg: response.data, response: response}
    }
  })
  .catch(error => handleError(error, fail))
}

export function msNameChange(msId, name, success, fail){
  axios.post(`${baseurl}/microservice/update`, {id: msId, name: name})
  .then(function(response){
    if(response.data === "PASS"){
      success(`微服务名${name}已保存`)
    }else{
      throw {msg: response.data, response: response}
    }
  })
  .catch(error => handleError(error, fail))
}

export function msDel(msId, msName, success, fail){
  axios.post(`${baseurl}/microservice/delete`, msId, {headers: {'Content-Type': 'application/json'}})
  .then(function(response){
    if(response.data === "PASS"){
      success(`微服务${msName}已删除`)
    }else{
      throw {msg: response.data, response: response}
    }
  })
  .catch(error => handleError(error, fail))
}

export function msAdd(name, success, fail){
  axios.post(`${baseurl}/microservice`, {name: name})
  .then(function(response){
    if(response.data.result === "PASS"){
      success(`新微服务${name}已添加`, response.data.obj.id)
    }else{
      throw {msg: response.data, response: response}
    }
  })
  .catch(error => handleError(error, fail))
}


export function userLogin(usr, psd, success, fail){
  axios.post(`${baseurl}/auth/signin`, undefined , {
    headers: {
      username: usr,
      password: psd
    }
  })
  .then(function(response){
    if(response.data === "SUCCESS"){
      localStorage.token = response.headers['authorization'];
      success(`登录成功`)
    }else{
      throw {msg: response.data, response: response}
    }
  })
  .catch(error => handleError(error, fail))
}