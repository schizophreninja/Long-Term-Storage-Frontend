export let settings = {
  serverAdress: 'http://localhost:8080',
  API: {
    loginPath: '/api/auth/login',
    myProfileDataPath: '/api/users/me',
    groupsPath: '/api/groups',
    uploadPath: '/api/tasks',
    deletePath: '/api/student-results',
    downloadPath: '/api/student-results',
    createTaskPath: '/api/groups',
    createTaskDescPath: '/api/tasks',
    createGroupPath: '/api/groups',
    createGroupFilePath: '/api/groups'
  }
}

export class Utils {
  
  static async fetchData(method, destination, data, headers = null) { // TODO: refactor
    let queryHeaders = ( headers == null ? {
      'Content-Type': 'application/json'
    } : headers );
    let query = {};

    switch(method) {
      case "POST": {
        query = {
          method: 'POST',
          headers: queryHeaders,
          body: JSON.stringify(data)
        };
        break;
      }
      case "GET": {
        query = {
          method: 'GET',
          headers: queryHeaders,
        };
        break;
      }
      case "formDataPOST": {
        query = {
          method: 'POST',
          headers: queryHeaders,
          body: data
        };
        break;
      }
      case "DELETE": {
        query = {
          method: 'DELETE',
          headers: queryHeaders,
          body: data
        };
        break;
      }
      case "fileGET": {
        query = {
          method: 'GET',
          headers: queryHeaders,
        };
        const response = await fetch(destination, query);
        let status = response.status;
        if(String(status)[0] === "4")
          return Promise.reject(status);
        
        return response.blob();
      }
    }
    const response = await fetch(destination, query);
    let status = response.status;
    if(String(status)[0] === "4")
      return Promise.reject(status);
    
    return response.json();
  }

  static isObjectEmpty(obj) {
    for(let item in obj) {
      return false;
    }
    return true;
  }
}