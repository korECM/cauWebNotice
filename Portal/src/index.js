const cau = require("../config").cau;
const chromium = require("chrome-aws-lambda");

module.exports.cauNotice = async (event, context) => {
  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    headless: /*chromium.headless*/ true
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080
  });

  let data = {};

  await login(page);
  data.cauNotice = await cauNotice(page);

  await browser.close();

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};

module.exports.notice = async (event, context) => {
  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    headless: /*chromium.headless*/ true
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080
  });

  let data = {};

  await login(page);
  data.notice = await notice(page);
  console.log("닫기 전 ");
  await browser.close();

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};

module.exports.schoolSchedule = async (event, context) => {
  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    headless: /*chromium.headless*/ true
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080
  });

  let data = {};

  await login(page);
  data.schoolSchedule = await schoolSchedule(page);

  await browser.close();

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};

module.exports.library = async (event, context) => {
  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    headless: /*chromium.headless*/ true
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080
  });

  let data = {};

  await login(page);
  await page.waitForSelector(
    "#P022 > div > div > div > div > header:nth-child(2) > div.nb-left > ol > li.ng-scope.on > span"
  );
  await page.waitFor(500);
  await scrollToBottom(page);

  data.library = await library(page);

  await browser.close();

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};

module.exports.all = async (event, context) => {
  // const pageToScreenshot = JSON.parse(event.body).pageToScreenshot;

  const browser = await chromium.puppeteer.launch({
    executablePath: await chromium.executablePath,
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    headless: /*chromium.headless*/ true
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080
  });

  let data = {};

  await login(page);
  data.cauNotice = await cauNotice(page);
  data.notice = await notice(page);
  data.schoolSchedule = await schoolSchedule(page);

  await scrollToBottom(page);

  data.library = await library(page);

  await browser.close();
  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};

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
  // await page.waitFor(1500);
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
    "#P021 > div > div > div > div > ol > li > div.nb-p-02-list-more.ng-scope > a:nth-child(1)"
  );

  await page.click(
    "#P021 > div > div > div > div > ol > li > div.nb-p-02-list-more.ng-scope > a:nth-child(1)"
  );

  // await page.waitFor(10000);
  let links;
  let titles;
  let dates;
  while (true) {
    // 데이터 추출
    await page.waitFor(1000);
    links = await page.evaluate(() => {
      const links = Array.from(
        document.querySelectorAll(
          "#P021 > div > div > div > div > ol > li > div.nb-padding-5-0.nb-font-13 > div > div > a"
        )
      );
      return links.map(data => data.href);
      // return text.map(data => data.textContent);
    });
    titles = await page.evaluate(() => {
      const text = Array.from(
        document.querySelectorAll(
          "#P021 > div > div > div > div > ol > li > div.nb-padding-5-0.nb-font-13 > div > div > a > em:nth-child(1)"
        )
      );
      return text.map(data => data.textContent);
      // return text.map(data => data.textContent);
    });

    dates = await page.evaluate(() => {
      const text = Array.from(
        document.querySelectorAll(
          "#P021 > div > div > div > div > ol > li > div.nb-padding-5-0.nb-font-13 > div > div > a > em.nb-t-right.nb-p-color-01.nb-rtrim > span"
        )
      );
      return text.map(data => data.textContent);
      // return text.map(data => data.textContent);
    });

    if (links.length > 0) {
      //   console.log(links);
      break;
    }
  }

  let data = [];
  for (let i = 0; i < titles.length; i++) {
    const link = links[i];
    const title = titles[i];
    const date = dates[i];
    data.push({
      title: title,
      link: link,
      date: date
    });
  }
  console.log(links.length);
  console.log(titles.length);
  console.log(dates.length);
  // await page.waitFor(1000000);
  return Promise.resolve(data);
}

async function notice(page) {
  let links;
  let titles;
  let dates;
  await page.waitForSelector(
    "#P004 > div > div > div > div > ol > li > div.nb-p-table.nb-padding-5-0.nb-font-13 > div > a"
  );
  while (true) {
    // 데인터 추출
    await page.waitFor(1000);
    links = await page.$$eval(
      "#P004 > div > div > div > div > ol > li > div.nb-p-table.nb-padding-5-0.nb-font-13 > div > a",
      l => {
        return l.map(data => data.href);
      }
    );
    titles = await page.$$eval(
      "#P004 > div > div > div > div > ol > li > div.nb-padding-5-0.nb-font-13 > div > a > em:nth-child(1) > span",
      t => {
        return t.map(data => data.textContent);
      }
    );
    dates = await page.$$eval(
      "#P004 > div > div > div > div > ol > li > div.nb-p-table.nb-padding-5-0.nb-font-13 > div > a > em.nb-p-nr.nb-t-right.nb-rtrim.nb-p-color-01 > span",
      d => {
        return d.map(data => data.textContent);
      }
    );
    if (links.length > 0) {
      break;
    }
  }

  let data = [];
  for (let i = 0; i < titles.length; i++) {
    const link = links[i];
    const title = titles[i];
    const date = dates[i];
    data.push({
      title: title,
      link: link,
      date: date
    });
  }

  return Promise.resolve(data);
}

async function schoolSchedule(page, data) {
  await page.waitForSelector(
    "#P014 > div > div > div > div > header:nth-child(2) > ol > li"
  );
  let scheduleNum = await page.$$eval(
    "#P014 > div > div > div > div > header:nth-child(2) > ol > li",
    d => {
      return d.length;
    }
  );

  let allData = [];
  for (let index = 0; index < scheduleNum; index++) {
    const selector =
      "#P014 > div > div > div > div > header:nth-child(2) > ol > li:nth-child(" +
      (index + 1) +
      ")";
    await page.click(selector);
    await page.waitFor(500);
    if (
      (await page.$(
        "#P014 > div > div > div > div > ol > li > div.nb-p-02-list-more.ng-scope > a:nth-child(1)"
      )) !== null
    ) {
      await page.click(
        "#P014 > div > div > div > div > ol > li > div.nb-p-02-list-more.ng-scope > a:nth-child(1)"
      );
    }

    const month = await page.$eval(
      "#P014 > div > div > div > div > header:nth-child(2) > ol > li:nth-child(" +
        (index + 1) +
        ") > span",
      d => {
        return d.textContent;
      }
    );

    // const result = await page.evaluate(() => {
    //   const text = Array.from(
    //     document.querySelectorAll(
    //       "#P014 > div > div > div > div > ol > li > div > div > div > a > em"
    //     )
    //   );
    //   return text.map(data => data.textContent);
    // });

    const titles = await page.$$eval(
      "#P014 > div > div > div > div > ol > li > div > div > div > a > em:nth-child(1)",
      d => {
        return d.map(d => d.textContent);
      }
    );

    const dates = await page.$$eval(
      "#P014 > div > div > div > div > ol > li > div > div > div > a > em:nth-child(2)",
      d => {
        return d.map(d => d.textContent);
      }
    );

    for (let i = 0; i < titles.length; i++) {
      const title = titles[i];
      const date = dates[i];
      allData.push({
        month: month,
        title: title,
        date: date
      });
    }
  }
  //   console.log(allData);
  return Promise.resolve(allData);
}

async function scrollToBottom(page) {
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitFor(500);
  return Promise.resolve();
}

async function library(page) {
  // 도서관 서울
  await page.click(
    "#P017 > div > div > div > div > header:nth-child(2) > div.nb-left > ol > li.ng-scope.on"
  );
  await page.waitFor(500);
  // 도서관 더보기 2번 클릭
  await page.click(
    "#P017 > div > div > div > div > ol > li > div.nb-p-02-list-more.ng-scope > a:nth-child(1)"
  );
  await page.click(
    "#P017 > div > div > div > div > ol > li > div.nb-p-02-list-more.ng-scope > a:nth-child(1)"
  );
  const libSeoulDataName = await page.$$eval(
    "#P017 > div > div > div > div > ol > li > div.nb-padding-5-0 > div > div.nb-p-row > ul > li.nb-t-left > a > span",
    d => {
      return d.map(data => data.textContent);
    }
  );
  const libSeoulDataAll = await page.$$eval(
    "#P017 > div > div > div > div > ol > li > div.nb-padding-5-0 > div > div.nb-p-row > ul > li:nth-child(2) > span",
    d => {
      return d.map(data => data.textContent);
    }
  );
  const libSeoulDataUsing = await page.$$eval(
    "#P017 > div > div > div > div > ol > li > div.nb-padding-5-0 > div > div.nb-p-row > ul > li:nth-child(3) > span",
    d => {
      return d.map(data => data.textContent);
    }
  );
  const libSeoulDataEmpty = await page.$$eval(
    "#P017 > div > div > div > div > ol > li > div.nb-padding-5-0 > div > div.nb-p-row > ul > li:nth-child(4) > span",
    d => {
      return d.map(data => data.textContent);
    }
  );

  await page.click(
    "#P017 > div > div > div > div > header:nth-child(2) > div.nb-left > ol > li:nth-child(2)"
  );
  await page.waitFor(500);

  const libLawDataName = await page.$$eval(
    "#P017 > div > div > div > div > ol > li > div.nb-padding-5-0 > div > div.nb-p-row > ul > li.nb-t-left > a > span",
    d => {
      return d.map(data => data.textContent);
    }
  );
  const libLawDataAll = await page.$$eval(
    "#P017 > div > div > div > div > ol > li > div.nb-padding-5-0 > div > div.nb-p-row > ul > li:nth-child(2) > span",
    d => {
      return d.map(data => data.textContent);
    }
  );
  const libLawDataUsing = await page.$$eval(
    "#P017 > div > div > div > div > ol > li > div.nb-padding-5-0 > div > div.nb-p-row > ul > li:nth-child(3) > span",
    d => {
      return d.map(data => data.textContent);
    }
  );
  const libLawDataEmpty = await page.$$eval(
    "#P017 > div > div > div > div > ol > li > div.nb-padding-5-0 > div > div.nb-p-row > ul > li:nth-child(4) > span",
    d => {
      return d.map(data => data.textContent);
    }
  );

  await page.click(
    "#P017 > div > div > div > div > header:nth-child(2) > div.nb-left > ol > li:nth-child(3)"
  );
  await page.waitFor(500);

  const libAnSeongDataName = await page.$$eval(
    "#P017 > div > div > div > div > ol > li > div.nb-padding-5-0 > div > div.nb-p-row > ul > li.nb-t-left > a > span",
    d => {
      return d.map(data => data.textContent);
    }
  );
  const libAnSeongDataAll = await page.$$eval(
    "#P017 > div > div > div > div > ol > li > div.nb-padding-5-0 > div > div.nb-p-row > ul > li:nth-child(2) > span",
    d => {
      return d.map(data => data.textContent);
    }
  );
  const libAnSeongDataUsing = await page.$$eval(
    "#P017 > div > div > div > div > ol > li > div.nb-padding-5-0 > div > div.nb-p-row > ul > li:nth-child(3) > span",
    d => {
      return d.map(data => data.textContent);
    }
  );
  const libAnSeongDataEmpty = await page.$$eval(
    "#P017 > div > div > div > div > ol > li > div.nb-padding-5-0 > div > div.nb-p-row > ul > li:nth-child(4) > span",
    d => {
      return d.map(data => data.textContent);
    }
  );

  let temp = {};
  temp.seoul = [];
  temp.anseong = [];
  temp.law = [];

  for (let i = 0; i < libSeoulDataName.length; i++) {
    const name = libSeoulDataName[i];
    const all = libSeoulDataAll[i];
    const using = libSeoulDataUsing[i];
    const empty = libSeoulDataEmpty[i];
    temp.seoul.push({
      name: name,
      all: all,
      using: using,
      empty: empty
    });
  }
  for (let i = 0; i < libAnSeongDataName.length; i++) {
    const name = libAnSeongDataName[i];
    const all = libAnSeongDataAll[i];
    const using = libAnSeongDataUsing[i];
    const empty = libAnSeongDataEmpty[i];
    temp.anseong.push({
      name: name,
      all: all,
      using: using,
      empty: empty
    });
  }
  for (let i = 0; i < libLawDataName.length; i++) {
    const name = libLawDataName[i];
    const all = libLawDataAll[i];
    const using = libLawDataUsing[i];
    const empty = libLawDataEmpty[i];
    temp.law.push({
      name: name,
      all: all,
      using: using,
      empty: empty
    });
  }

  return Promise.resolve(temp);
}
