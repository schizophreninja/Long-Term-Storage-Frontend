import { Utils, settings } from './Utils.js'

class Group {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.element = null;
  }

  renderListItem() {
    this.element = document.createElement("div");
    this.element.setAttribute("groupId", this.id);
    this.element.classList.add("groups__item",);
    this.element.innerHTML = `
      <img src="images/group.svg" alt="" class="groups__item-icon">
      <span class="groups__item-name">${this.name}</span>
    `;
    groupsContainer.prepend(this.element);
  }
}

// display groups list
const groupsContainer = document.querySelector(".groups");
let groups = [];
getGroupsList()
.then(res => { // display groups after getting data
  groups = res;
  console.log(groups);
})

// group choice
let currentGroup = null;
const contentContainer = document.querySelector(".content");

groupsContainer.addEventListener("mousedown", (event) => {
  changeContent(event.target);
});

function changeContent(target) {
  const groupId = target.getAttribute("groupId");
  if(!groupId || groupId == currentGroup?.id) return false;
  currentGroup?.element.classList.remove("--selected-group")

  currentGroup = groups[groupId];
  currentGroup.element.classList.add("--selected-group");
  contentContainer.innerHTML = ""; // clear content side
  renderTable(groupId);
}


function getGroupsList() {
  return new Promise((resolve, reject) => {
    let groups = [];

    Utils.fetchData('GET', settings.serverAdress + settings.API.groupsPath, null, null)
    .then(data => {
      data.forEach(element => {
        let currElem = new Group(element.name, element.id);
        currElem.renderListItem();
        groups[currElem.id] = currElem;
      });
      resolve(groups);
    })
    .catch(err => reject(err));
  });
}

function renderTable(groupId) {
  let table = [];
  /*
    [
      ["Бояршинов", Работа1, Работа2, Работа3];
    ]
  */
  let contentElement = document.createElement("div");
  contentElement.className = "table__wrapper";
  contentElement.innerHTML = '<table class="item-table" cellpadding="5"></table>';
  let tableElement = contentElement.children[0];

  getTasks()
  .then(() => {
    Utils.fetchData('GET', settings.serverAdress + settings.API.groupsPath + `/${groupId}/users`, null, null)
    .then(data => {
      data.forEach(element => {
        table[element.id] = [];
        for(let key in table[0]) {
          table[element.id][key] = "";
        }
        table[element.id][0] = `${element.lastName} ${element.firstName}`;
      });
    }).then(() => {
      Utils.fetchData('GET', settings.serverAdress + settings.API.groupsPath + `/${groupId}/student-results`, null, null)
      .then(data => {
        data.forEach(element => {
          table[element.userId][element.taskId] = '<a href = "file:/${i56jt349}">Скачать</a>';
        });
      })
      .then(() => {
        let innerHTML = ``;
        table.forEach((el, idx) => {
          innerHTML += `<tr class = "item-table__row">`
          table[idx].forEach((el, idx) => {
            if(idx == 0 && el != "") 
              innerHTML += `<th class="item-table__column">${el}</th>`
            else 
              innerHTML += `<td class="item-table__column">${el}</td>`
          })
          innerHTML += `</tr>`
        });
        tableElement.innerHTML = innerHTML;
      })
    })
   })

  function getTasks() {
    return new Promise((resolve, reject) => {
      Utils.fetchData('GET', settings.serverAdress + settings.API.groupsPath + `/${groupId}/tasks`, null, null)
      .then(data => {
        table[0] = [];
        table[0][0] = "Студент"
        data.forEach(element => {
          table[0][element.id] = element.name;
        })
        resolve();
      })
    });
  }

  function getUsers() {

  }
  function getResults() {

  }

  function render() {

  }
  contentContainer.appendChild(contentElement);
}
