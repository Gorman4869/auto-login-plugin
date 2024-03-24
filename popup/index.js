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
const nickName = find("#nickName");
const account = find("#account");
const password = find("#password");
const accountForm = find(".account-form");
const accountArea = find("#accountArea");

const AutoLoginPlugin = {
  initButton: function () {},
  init: function () {
    this.initButton();
  },
};

AutoLoginPlugin.init();
