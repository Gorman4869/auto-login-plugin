const find = function (selector) {
  return document.querySelector(selector);
};

const sendMessage = chrome.tabs.sendMessage;
const onMessage = chrome.runtime.onMessage;
const query = chrome.tabs.query;

const addAccountBtn = find("#addAccountBtn");
// const confirmBtnArea = find(".confirm-btn-wrap");
const confirmBtn = find("#confirmBtn");
const cancelBtn = find("#cancelBtn");
const nickNameInput = find("#nickName");
const accountInput = find("#account");
const passwordInput = find("#password");
const accountForm = find(".account-form");
const accountArea = find("#accountArea");

const AutoLoginPlugin = {
  initAccountButton: function () {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        this.createAccountButton(key);
      }
    }
  },
  bindEvent: function () {
    let that = this;
    //添加账号按钮
    addAccountBtn.addEventListener("click", function () {
      that.showAccountForm();
    });
    //取消按钮
    cancelBtn.addEventListener("click", function () {
      location.reload();
    });
    //确定按钮
    confirmBtn.addEventListener("click", function () {
      let nickName = nickNameInput.value;
      let account = accountInput.value;
      let password = passwordInput.value;
      //check
      if (nickName === "" || account === "" || password === "") {
        alert("请完善表单");
        return;
      }
      if (localStorage.hasOwnProperty(nickName)) {
        alert("存在相同名称的账号");
        return;
      }

      let tempObj = {
        account: account,
        password: password,
      };
      that.setStorage(nickName, JSON.stringify(tempObj));
      that.resetAccountForm();
      location.reload();
    });

    //已存在的账号和删除按钮
    accountArea.addEventListener("click", function (e) {
      e.stopPropagation();
      let target = e.target;
      let className = e.target.className;
      let key = "";
      let storageObj = null;

      if (className === "account-btn account-area-btn") {
        //账号密码回填
        key = target.parentNode.getAttribute("storage-key");
        storageObj = JSON.parse(that.getStorage(key));
        that.fillTheBlank(storageObj.account, storageObj.password);
      } else if (className === "fa fa-trash") {
        key = target.parentNode.parentNode.getAttribute("storage-key");
        that.delStorage(key);
        location.reload();
      } else {
        console.log("点了其它元素");
      }
    });
  },
  //创建已存账号
  createAccountButton: function (storageKey) {
    //创建account-area-item
    let itemDiv = document.createElement("div");
    itemDiv.className = "account-area-item";
    itemDiv.setAttribute("storage-key", storageKey);

    //创建账号按钮
    let accountBtn = document.createElement("button");
    accountBtn.className = "account-btn account-area-btn";
    accountBtn.innerText = storageKey;

    //创建account-area-icon
    let iconDiv = document.createElement("div");
    iconDiv.className = "account-area-icon";

    //创建i标签
    let icon = document.createElement("i");
    icon.className = "fa fa-trash";

    iconDiv.appendChild(icon);
    itemDiv.appendChild(accountBtn);
    itemDiv.appendChild(iconDiv);

    accountArea.appendChild(itemDiv);
  },
  //显示账号填写表单
  showAccountForm() {
    addAccountBtn.style.display = "none";
    accountForm.style.display = "block";
  },
  //存
  setStorage(key, value) {
    localStorage.setItem(key, value);
  },
  //取
  getStorage(key) {
    return localStorage.getItem(key);
  },
  //删除
  delStorage(key) {
    localStorage.removeItem(key);
  },
  //重置
  resetAccountForm() {
    nickNameInput.value = "";
    accountInput.value = "";
    passwordInput.value = "";
  },
  //回填账号密码
  fillTheBlank: function (account, password) {
    query(
      {
        active: true,
        currentWindow: true,
      },
      function (tabs) {
        sendMessage(
          tabs[0].id,
          {
            action: "FILL_THE_BLANK",
            account: account,
            password: password,
          },
          function (res) {
            console.log(res, "response");
          }
        );
      }
    );
  },
  init: function () {
    this.initAccountButton();
    this.bindEvent();
  },
};

AutoLoginPlugin.init();
