const puppeteer = require("puppeteer");
const cau = require("./config").cau;

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080
  });
  await login(page);
  await cauNotice(page);
  await notice(page);
  await schoolSchedule(page);

  await scrollToBottom(page);

  await library(page);

  await page.waitFor(1000000);
  await browser.close();
})();

async function login(page) {
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
  return Promise.resolve();
}

async function cauNotice(page) {
  // 찾으려는 데이터 나올 때까지 대기
  await page.waitForSelector(
    "#nbPortletView > div:nth-child(2) > section:nth-child(2) > div > div > div > div > ol > li > div.nb-p-02-list-more.ng-scope > a:nth-child(1)"
  );
  // 더보기 버튼 누르기
  await page.click(
    "#nbPortletView > div:nth-child(2) > section:nth-child(2) > div > div > div > div > ol > li > div.nb-p-02-list-more.ng-scope > a:nth-child(1)"
  );

  await page.waitForSelector(
    "#P004 > div > div > div > div > ol > li > div.nb-p-02-list-more.ng-scope > a:nth-child(1)"
  );

  await page.click(
    "#P004 > div > div > div > div > ol > li > div.nb-p-02-list-more.ng-scope > a:nth-child(1)"
  );

  // await page.waitFor(10000);

  while (true) {
    // 데이터 추출
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
      return links.map(data => data.href);
      // return text.map(data => data.textContent);
    });
    if (result.length > 0) {
      console.log(result);
      break;
    }
  }
  return Promise.resolve();
}

async function notice(page){
  while (true) {
    // 데인터 추출
    await page.waitFor(1000);
    const result = await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll(
          "#P004 > div > div > div > div > ol > li > div.nb-p-table.nb-padding-5-0.nb-font-13 > div > a"
        )
      );
      const text = Array.from(
        document.querySelectorAll(
          "#P004 > div > div > div > div > ol > li > div.nb-padding-5-0.nb-font-13 > div > a > em > span"
        )
      );
      return links.map(data => data.href);
      // return text.map(data => data.textContent);
    });
    if (result.length > 0) {
      console.log(result);
      break;
    }
  }
  return Promise.resolve();
}

async function schoolSchedule(page){
  let scheduleNum = await page.evaluate(x => {
    return Promise.resolve(Array.from(
      document.querySelectorAll("#P014 > div > div > div > div > header:nth-child(2) > ol > li")
    ).length);
  }, 7);

  let allData = [];
  for (let index = 0; index < scheduleNum; index++) {
    const selector = "#P014 > div > div > div > div > header:nth-child(2) > ol > li:nth-child(" + (index + 1) + ")";
    await page.click(selector);
    await page.waitFor(500);
    if (await page.$("#P014 > div > div > div > div > ol > li > div.nb-p-02-list-more.ng-scope > a:nth-child(1)") !== null) {
      await page.click(
        "#P014 > div > div > div > div > ol > li > div.nb-p-02-list-more.ng-scope > a:nth-child(1)"
      );
    }

    const result = await page.evaluate(() => {
      const text = Array.from(
        document.querySelectorAll(
          "#P014 > div > div > div > div > ol > li > div > div > div > a > em"
        )
      );
      return text.map(data => data.textContent);
    });
    allData.push(result);
  }
  console.log(allData);
  return Promise.resolve();
}

async function scrollToBottom(page){
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitFor(500);
  return Promise.resolve();
}

async function library(page){
    // 도서관 서울
    await page.click(
      "#P017 > div > div > div > div > header:nth-child(2) > div.nb-left > ol > li.ng-scope.on"
    );
    await page.waitFor(500);
    // 도서관 더보기 2번 클릭
    await page.click(
      "#P017 > div > div > div > div > ol > li > div.nb-p-02-list-more.ng-scope > a:nth-child(1)"
    )
    await page.click(
      "#P017 > div > div > div > div > ol > li > div.nb-p-02-list-more.ng-scope > a:nth-child(1)"
    )
    const libSeoulData = await page.evaluate(() => {
      const text = Array.from(
        document.querySelectorAll(
          "#P017 > div > div > div > div > ol > li > div.nb-padding-5-0 > div > div.nb-p-row > ul"
        )
      );
      return text.map(data => data.textContent);
    })
    console.log(libSeoulData);
  
    await page.click(
      "#P017 > div > div > div > div > header:nth-child(2) > div.nb-left > ol > li:nth-child(2)"
    );
    await page.waitFor(500);
    const libLawData = await page.evaluate(() => {
      const text = Array.from(
        document.querySelectorAll(
          "#P017 > div > div > div > div > ol > li > div > div > div.nb-p-row > ul"
        )
      );
      return text.map(data => data.textContent);
    })
    console.log(libLawData);
  
    await page.click(
      "#P017 > div > div > div > div > header:nth-child(2) > div.nb-left > ol > li:nth-child(3)"
    );
    await page.waitFor(500);
    await page.click(
      "#P017 > div > div > div > div > ol > li > div.nb-p-02-list-more.ng-scope > a:nth-child(1)"
    );
  
    const libAnSeongData = await page.evaluate(() => {
      const text = Array.from(
        document.querySelectorAll(
          "#P017 > div > div > div > div > ol > li > div.nb-padding-5-0 > div > div.nb-p-row > ul"
        )
      );
      return text.map(data => data.textContent);
    })
    console.log(libAnSeongData);
    return Promise.resolve();
}