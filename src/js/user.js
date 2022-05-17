import { settings, Utils } from "./Utils.js";
import { updateUserInterface, showNotification } from "./interface.js";

export let user = ( setTimeout(updateUserInterface, 0), JSON.parse(sessionStorage.getItem("userData")) || {} ); // Проверяем есть ли в sessionStorage данные. Далее записываем их в user, иначе записываем пустой объект и обновляем интерфейс     

export class User {
  async init(login, password) {
    await User.login(login, User.hashPassword(password))
    .then(response => {
      if(response.errorMessage != undefined) { 
        throw new Error(response.errorMessage);
      }
      this.login = response.login;
      this.name = response.name;
      this.surname = response.surname || null;
      this.accessJws = response.accessJws;
      this.refreshJws = response.refreshJws;

      return Utils.fetchData('GET', settings.serverAdress + settings.API.myProfileDataPath, null, {
        'Authorization': `Bearer ${this.accessJws}`
      });
    })
    .then(response => { // get user full name
      this.id = response.id;
      this.name = response.firstName;
      this.surname = response.lastName;
      this.patronymic = response.fatherName;
      this.roles = response.userRoles;
      // this.group = response.group;
    })
    .then(() => {
      sessionStorage.setItem("userData", JSON.stringify(this));
      showNotification('success', "Вы успешно авторизовались!");
      updateUserInterface();
    })
    .catch(() => showNotification('error', "Ошибка авторизации!"));
  }

  changeUserInfo(newInfo) {}

  get fullName() {
    return this.name + " " + this.surname;
  }

  static hashPassword(rawPassword) {
    return rawPassword;
  }

  static async login(login, passwordHash) {
    return Utils.fetchData('POST', settings.serverAdress + settings.API.loginPath, {
      'login': login,
      'password': passwordHash,
    })
  }
}

export function onLoginAttempt(login, password) {
  user = new User();
  return user.init(login, password); //.then(() => updateUserInterface(), err => reject(err)); // return promise
}