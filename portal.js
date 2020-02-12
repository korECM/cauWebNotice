const puppeteer = require("puppeteer");
const cau = require("./config");
// const getTitle = () => {
//     return puppeteer.launch()
//         .then((browser) => {
//             return browser.newPage()
//                 .then((page) => {
//                     return page.goto('https://blog.outsider.ne.kr/', {
//                             waitUntil: 'networkidle2'
//                         })
//                         .then(() => page.evaluate(() => {
//                             return document.querySelector('title').innerHTML;
//                         }))
//                 })
//                 .then((title) => {
//                     browser.close();
//                     return title;
//                 });
//         });
// };

// exports.handler = (event, context, callback) => {
//     getTitle()
//         .then(context.succeed)
//         .catch(context.fail);
// };

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  // const id = "jeffyoun";
  // const pw = "jw0220eating";

  const id = cau.id;
  const pw = cau.pw;

  // 포탈로 가라
  await page.goto(
    "https://mportal.cau.ac.kr/common/auth/SSOlogin.do?redirectUrl=/main.do"
  );

  await page.waitForSelector('input[id="txtUserID"]');
  // 아이디, 비번 입력
  await page.evaluate(
    (id, pw) => {
      document.querySelector('input[id="txtUserID"]').value = id;
      document.querySelector('input[id="txtPwd"]').value = pw;
    },
    id,
    pw
  );

  //로그인 버튼을 클릭해라
  await page.click("#form1 > div > div > div.login-wrap > a");

  // 찾으려는 데이터 나올 때까지 대기
  await page.waitForSelector(
    "#nbPortletView > div:nth-child(2) > section:nth-child(2) > div > div > div > div > ol > li > div.nb-p-02-list-more.ng-scope > a:nth-child(1)"
  );
  // 더보기 버튼 누르기
  await page.click(
    "#nbPortletView > div:nth-child(2) > section:nth-child(2) > div > div > div > div > ol > li > div.nb-p-02-list-more.ng-scope > a:nth-child(1)"
  );

  // await page.waitFor(10000);

  while(true){
    // 데인터 추출
    await page.waitFor(1000);
    const result = await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll(
          "#P021 > div > div > div > div > ol > li > div.nb-padding-5-0.nb-font-13 > div > div > a"
        )
      );
      const text = Array.from(
        document.querySelectorAll(
          "#P021 > div > div > div > div > ol > li > div.nb-padding-5-0.nb-font-13 > div > div > a > em > span"
        )
      );
      return text.map(data => data.textContent);
    });
    if(result.length > 0){
      console.log(result);
      break;
    }
  }

    // return anchors.map(anchor => anchor.textContent);
    // return anchors.map((data) => data.hrewweWwwf);


  await page.waitFor(1000000);
  await browser.close();
})();

// console.log(getTitle());
