import { Utils, settings } from './Utils.js'
import { User, user } from './user.js'
import { showModal, closeModal, showNotification } from './interface.js'

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

let table = [];

// display groups list
const groupsContainer = document.querySelector(".groups");


if(user?.isAdmin) {
  let element = document.createElement("div");

  element.classList.add("groups__item",);
  element.innerHTML = `
    <img src="images/plus.svg" alt="" class="groups__add">
    <span class="groups__item-name">Добавить группу</span>
  `;
  groupsContainer.prepend(element); 

  element.addEventListener("click", showCreateGroupModal)
}

function showCreateGroupModal() {
  let innerHTML = `
    <div class="modal__container">
      <div class="modal__label">Создание новой группы</div>
      <div class="modal__content">
        <label for="group-name">Наименование группы:&nbsp;</label>
        <input type="text" id="group-name" name="name" required>
        <br/>
        <form>

          <label for="group-file">Выберите файл:&nbsp;</label>
          <input type="file" id="group-file" name="csvFile" required>
          <br/>

          <input class="modal__submit" type="submit" value="Загрузить">
        </form>
        <div class = "modal__cancel-button">&#215;</div>
      </div>
    </div>
  `
  let createGroupModal = showModal(innerHTML, "Загрузка работы");
  let closeButton = createGroupModal.querySelector(".modal__cancel-button");
  let form = createGroupModal.querySelector("form");

  //try {
    createGroupModal.addEventListener("submit", event => {
      event.preventDefault();

      let fetchHeader = {
        'Authorization': `Bearer ${user.accessJws}`,
        'Content-Type': 'application/json'
      };


      Utils.fetchData("POST", settings.serverAdress + settings.API.createGroupPath, {
        name: createGroupModal.querySelector("#group-name").value
      }, fetchHeader)
      .then(group => {
        Utils.fetchData("formDataPOST", 
        settings.serverAdress + settings.API.createGroupFilePath + `/${group.id}/users`, new FormData(form), {
            'Authorization': `Bearer ${user.accessJws}`
        })
      })
      .then(() => showNotification("success", "Группа успешно добавлена!"))
      .catch(() => showNotification("error", "Возникла ошибка при добавлении группы!"))
      .finally(() => {
        closeModal();
        contentContainer.innerHTML = "";
        window.location.reload(); // TODO: Remove
      });
    });
    closeButton.addEventListener("click", closeModal);
}

let groups = [];
getGroupsList()
.then(res => { // display groups after getting data
  groups = res;
  console.log(groups);
})

let uploadButton = document.createElement("div");
uploadButton.classList.add("table__upload");
uploadButton.innerHTML = "+";

function showUploadModal() {
  let tasksHTML = ``;
  table[0].forEach((el, idx) => {
    if(idx == 0) return;
    tasksHTML += `<option value="${idx}">${el}</option>`;
  })

  

  let innerHTML = `
    <div class="modal__container">
      <div class="modal__label">Загрузка работы</div>
      <div class="modal__content">
      <label for="upload__selection">Выберите задание:&nbsp;</label>
      <select id = "upload__selection">
        ${tasksHTML}
      </select>
        <form>
          <label for="upload-file">Выберите файл:&nbsp;</label>
          <input type="file" id="upload-file" name="file" required>
          <br/>
          <input class="modal__submit" type="submit" value="Загрузить">
        </form>
        <div class = "modal__cancel-button">&#215;</div>
      </div>
    </div>
  `
  let uploadModal = showModal(innerHTML, "Загрузка работы");
  let closeButton = uploadModal.querySelector(".modal__cancel-button");
  
  //try {
    uploadModal.addEventListener("submit", event => {
      event.preventDefault();
      let taskID = Number(uploadModal.querySelector("#upload__selection").value);

      let fetchHeader = {
        'Authorization': `Bearer ${user.accessJws}`
      };

      Utils.fetchData("DELETE", settings.serverAdress + settings.API.deletePath + `/${getResultId(currentGroup.id, taskID, user.id)}`, null, fetchHeader)
      .catch()
      .finally(() => {
        Utils.fetchData("formDataPOST", 
        settings.serverAdress + settings.API.uploadPath + `/${taskID}/student-results`, new FormData(uploadModal.querySelector("form")), fetchHeader)
        .then(response => {
          showNotification("success", "Работа успешно загружена!");

          contentContainer.innerHTML = "";
          renderTable(currentGroup.id);
        })
        .catch(() => showNotification("error", "Возникла ошибка при загрузке работы!"))
        .finally(() => closeModal());
      });
    });


    closeButton.addEventListener("click", closeModal);

    //closeButton.addEventListener()
  //} catch {
    //showNotification("error", "Возникла ошибка! \nПопробуйте позже");
  //}
}

function showCreateTaskModal() {

  let innerHTML = `
  <div class="modal__container">
    <div class="modal__label">Добавление задачи</div>
    <div class="modal__content">
      <form>
        <label for="task-name">Название задания:&nbsp;</label>
        <input type="text" id="task-name" name="name" required>
        <br/>

        <label for="task-file">Выберите файл:&nbsp;</label>
        <input type="file" id="task-file" name="file">
        <br/>

        <input class="modal__submit" type="submit" value="Загрузить">
      </form>
      <div class = "modal__cancel-button">&#215;</div>
    </div>
  </div>
`
  let createTaskModal = showModal(innerHTML, "Создание задачи");
  let closeButton = createTaskModal.querySelector(".modal__cancel-button");
  let form = createTaskModal.querySelector("form");

  //try {
    createTaskModal.addEventListener("submit", event => {
      event.preventDefault();

      let fetchHeader = {
        'Authorization': `Bearer ${user.accessJws}`,
        'Content-Type': 'application/json'
      };


      Utils.fetchData("POST", settings.serverAdress + settings.API.createTaskPath + `/${currentGroup.id}/tasks`, {
        name: form.querySelector("#task-name").value
      }, fetchHeader)
      .then(task => {
        if(form.querySelector("#task-file") !== "") {
          Utils.fetchData("formDataPOST", 
          settings.serverAdress + settings.API.createTaskDescPath + `/${task.id}/file`, new FormData(form), {
              'Authorization': `Bearer ${user.accessJws}`
          })
        }
      })
      .then(() => showNotification("success", "Задача успешно добавлена!"))
      .catch(() => showNotification("error", "Возникла ошибка при добавлении задачи!"))
      .finally(() => {
        closeModal();
        contentContainer.innerHTML = "";
        renderTable(currentGroup.id);
      });
    });
    closeButton.addEventListener("click", closeModal);
}

let uploadModal = null;
uploadButton.addEventListener("mouseup", () => {
  if(user.isAdmin) showCreateTaskModal();
  else showUploadModal();
});


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
  table = [];
  /*
    [
      ["Бояршинов", Работа1, Работа2, Работа3];
    ]
  */
  let contentElement = document.createElement("div");
  contentElement.className = "table__wrapper";
  contentElement.innerHTML = '<table class="item-table" cellpadding="5"></table>';
  let tableElement = contentElement.children[0];
  if(!Utils.isObjectEmpty(user)) {
    if( user.isAdmin || (user.group?.id == groupId && user.group?.isActive) ) 
      contentElement.appendChild(uploadButton);
  }

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
          table[element.userId][element.taskId] = `<a resultId = "${element.id} ">Скачать</a>`;
        });
      })
      .then(() => {
        let innerHTML = ``;
        
        table.forEach((rowEl, rowIdx) => {
          innerHTML += `<tr class = "item-table__row" taskID = ${rowIdx}>`
          table[rowIdx].forEach((colEl, colIdx) => {
            if(colIdx == 0 && colEl != "") {
              innerHTML += `<th class="item-table__column">${colEl}</th>`
            } else {
              innerHTML += `<td class="item-table__column">${colEl}</td>`
            }
          })
          innerHTML += `</tr>`
        });
        tableElement.innerHTML = innerHTML;
      })
      .then(() => {
        contentContainer.appendChild(contentElement);
        updateLinks();
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

}

function updateLinks() {
  let elements = contentContainer.querySelectorAll("a[resultid]");
  elements.forEach(el => {
    let resultId = Number(el.getAttribute("resultid"));
    if(isNaN(resultId)) return;
    el.addEventListener("click", () => downloadResult(resultId))
  })
}

function downloadResult(resultId) {
  Utils.fetchData('fileGET', settings.serverAdress + settings.API.downloadPath + `/${resultId}/file`, null, null)
  .then(Blob => {
    let fileURL = URL.createObjectURL(Blob);
    window.open(fileURL);
  });
}

function getResultId(groupId, taskId, userId) {
  if(groupId != currentGroup.id) return false;
  
  let result = false;
  try {
    let innerHTML = table[userId][taskId];
    let tempElement = document.createElement("a");
    tempElement.innerHTML = innerHTML;
    tempElement = tempElement.children[0];

    let id = Number(tempElement.getAttribute("resultId"));
    result = isNaN(id) ? false : id;
  }
  finally {
    return result;
  }
}