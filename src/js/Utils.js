export let settings = {
  serverAdress: 'http://localhost:8080',
  API: {
    loginPath: '/api/auth/login',
    myProfileDataPath: '/api/users/me',
    groupsPath: '/api/groups'
  }
}

export class Utils {
  
  static async fetchData(method, destination, data, headers = null) {
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
    }
    const response = await fetch(destination, query);
    return response.json();
  }

  static isObjectEmpty(obj) {
    for(let item in obj) {
      return false;
    }
    return true;
  }
}