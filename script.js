let groupsContainer = document.querySelector(".groups");
let contentContainer = document.querySelector(".content");
let groups = [];
let currentGroup = null;

groupsContainer.addEventListener("mousedown", (event) => {
  changeContent(event.target);
});

let selectedGroupId = -1;
let userData = {
  name: "Nikita",
  surname: "Boyarshinov",
  login: "skeez",
  sessionId: "...",
}

function Group(name, id) {
  if(!new.target) return new Group();

  this.name = name;
  this.id = id;
  this.element = null;
}

Group.prototype = Object.assign({}, Object.prototype, {
  renderItem: function() {
    this.element = document.createElement("div");
    this.element.setAttribute("groupId", this.id);
    this.element.classList.add("groups__item",);
    this.element.innerHTML = `
      <img src="images/group.svg" alt="" class="groups__item-icon">
      <span class="groups__item-name">${this.name}</span>
    `;
    groupsContainer.prepend(this.element);
  }
});

function getGroupsList() {
  let groups = [];

  groups[0] = new Group("ИС-11", 0);
  groups[1] = new Group("ИС-21", 1);

  groups[0].renderItem();
  groups[1].renderItem();

  return groups;
}

function renderContent(group) {
  let el = document.createElement("div");
  el.className = "table__wrapper";
  // TEMPORARY
  el.innerHTML = `                            
    <table class="item-table" cellpadding="5">
      <!-- Header -->
      <tr class="item-table__header">
        <th class="item-table__column"></th>
        <th class="item-table__column">Техническое задание</th>
        <th class="item-table__column">Пояснительная записка</th>
        <th class="item-table__column">Лист задания</th>
        <th class="item-table__column">Титульный лист</th>
      </tr>
      
      <!-- Body -->
      <tr class="item-table__row">
        <td class="item-table__user">
          Boyarshinov Nikita
        </td>

        <td class="item-table__column">
          <div class="item-table__cell">+</div>	
        </td>
        <td class="item-table__column">
          <div class="item-table__cell">+</div>	
        </td>
        <td class="item-table__column">
          <div class="item-table__cell">5</div>	
        </td>
        <td class="item-table__column">
          <div class="item-table__cell">2</div>	
        </td>
      </tr>
    </table>
  `;
  contentContainer.innerHTML = "";
  contentContainer.appendChild(el);
}

function changeContent(target) {
  const groupId = target.getAttribute("groupId");
  currentGroup?.element.classList.remove("--selected-group")

  currentGroup = groups[groupId];
  currentGroup.element.classList.add("--selected-group");
  renderContent(/* TODO */);

}

groups = getGroupsList();