console.log("autoLogin：insert script => crm.js");
const find = function (selector) {
  return document.querySelector(selector);
};
let testAccount = "";
let testPassword = "";
let testValid = "";
let testBtn = "";
let testCaptchaBase64 = "";
let testTesseractFn;
//TODO 为啥要在这里面才能获取到第三方库代码
setTimeout(() => {
  testAccount = find('input[name="username"]');
  testPassword = find('input[name="password"]');
  testValid = find('input[placeholder="验证码"]');

  //   console.log(Tesseract, "333");
  testTesseractFn = async (base64) => {
    const worker = await Tesseract.createWorker("eng");
    const charCodes = ["+", "-", "*", "/"];
    for (let i = 0; i < 26; i++) {
      if (i <= 9) charCodes.push(i);
      charCodes.push(String.fromCharCode(97 + i), String.fromCharCode(65 + i)); //生成 a-z 26 个大小写字母
    }
    await worker.setParameters({
      tessedit_char_whitelist: charCodes.join(""),
    });
    const ret = await worker.recognize(base64);
    // textLogWithStyle(
    //   `recognize code result = ${ret.data.text.replace("\n", "")}`
    // );
    await worker.terminate();
    return ret.data;
  };
}, 1000);
const sendMessage = chrome.runtime.sendMessage;
const onMessage = chrome.runtime.onMessage;
// const accountInput = find("#name");
// const passwordInput = find("#password");
// const loginButton = find('input[name="username"]');

const Page = {
  bindEvent: function () {
    let that = this;
    onMessage.addListener(async function (req, sender, sendResponse) {
      if (req.action === "FILL_THE_BLANK") {
        console.log("Fill the login information of CRM...");
        // that.InputEvent(accountInput, req.account);
        // that.InputEvent(passwordInput, req.password);
        that.InputEvent(testAccount, req.account);
        that.InputEvent(testPassword, req.password);
        testCaptchaBase64 = find(".el-image__inner").src;
        const result = await testTesseractFn(testCaptchaBase64);
        console.log(result, "111");
        // loginButton.click();
        sendResponse("Success.");
      } else {
        sendResponse("Errr");
      }
    });
  },
  InputEvent: function (element, value) {
    console.log("触发事件");
    element.focus();
    element.value = value;
    let elementInputEvent = new Event("input", { bubbles: true });
    element.dispatchEvent(elementInputEvent);
  },
  init: function () {
    this.bindEvent();
  },
};

Page.init();
