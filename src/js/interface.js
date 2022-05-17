import { onLoginAttempt, user } from "./user.js";
import { Utils } from "./Utils.js";
//import "./groups.js"

const mainContainer = document.querySelector(".container");

const loginIcon = document.querySelector(".header__login-icon");
const loginScreen = document.querySelector(".login-screen");
const loginCancelButton = document.querySelector(".login-screen__button[value='Отмена']")
const loginForm = document.querySelector(".login-screen__form");

const nameContainer = document.querySelector(".header__profile-name");

const notification = document.querySelector(".notification");

const notificationCancelButton = document.querySelector(".notification__cancel");
let notificationTimer = null;

notificationCancelButton.addEventListener("click", cancelNotification);


loginCancelButton.addEventListener("mousedown", () => {
  mainContainer.style.filter = "none";
  setTimeout(() => {
    loginScreen.style.display = "none"
    loginForm.style.opacity = "0";
  });
});

loginIcon.addEventListener("mousedown", () => {
  //Promise.resolve(loginScreen.style.display = "block").then(() => loginScreen.style.width = "900px");
  
  loginScreen.style.display = "block";
  mainContainer.style.filter = "blur(2px)";
  setTimeout(() => loginForm.style.opacity = "1", 200);
})

loginCancelButton.addEventListener("mousedown", () => {
  hideLoginForm();
});

function hideLoginForm() {
  mainContainer.style.filter = "none";
  setTimeout(() => {
    loginScreen.style.display = "none"
    loginForm.style.opacity = "0";
  });
}

export function updateUserInterface() {
  if(Utils.isObjectEmpty(user)) return true;
  
  const profileInfo = document.querySelector(".header__profile");
  const profileName = user.name + " " + user.patronymic;

  profileInfo.innerHTML = `
    <span class="header__profile-name">${profileName}</span>
    <img src="images/user.svg" alt="profile-avatar" class="header__profile-avatar">
  ` 
}

export function showNotification(type, message) {
  let content = document.createElement("p");
  content.classList.add("notification__content")
  content.innerHTML = message;
  notification.append(content);
  notification.classList.add("notification--" + type, "notification--shown");
  notificationTimer = setTimeout(cancelNotification, 5000);
}

function cancelNotification() {
  clearTimeout(notificationTimer);
  notification.classList.remove("notification--shown");
  notification.addEventListener("transitionend", normalise);

  function normalise() {
    notification.childNodes[notification.childNodes.length - 1].remove();
    notification.removeEventListener("transitionend", normalise);
  }
}


document.addEventListener("submit", (event) => {
  event.preventDefault();
  const login = document.querySelector(".login-screen__input[name='login']").value;
  const password = document.querySelector(".login-screen__input[name='password']").value;
  
  onLoginAttempt(login, password);
  
  hideLoginForm();
})