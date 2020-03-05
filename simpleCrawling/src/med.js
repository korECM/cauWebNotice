const getArticle = require("../lib/api");
const { save, read } = require("../lib/db");
const Med = require("../models/med");

module.exports.saveNotice = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const response = await getArticle(
      [
        {
          url:
            "http://med.cau.ac.kr/site/program/board/basicboard/list.do?menuid=001002001001&boardtypeid=3",
          trSelector: "#searchForm > div.list_type_h1 > ul > li",
          dataFunc: $ => {
            const date = `${$(this)
              .find("a > span.l > span.day2")
              .text()}-${$(this)
              .find("a > span.l > span.day1")
              .text()}`;
            const link = `http://med.cau.ac.kr/site/program/board/basicboard${$(
              this
            )
              .find("a")
              .prop("href")
              .slice(1)}`;
            const title = $(this)
              .find("a > span.r > span")
              .text();
            return {
              title,
              link,
              date
            };
          }
        }
      ],
      save(Med)
    );
    console.log(response);
    return response;
  } catch (error) {
    return error;
  }
};
module.exports.readNotice = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    response = await read(Med);
    return response;
  } catch (error) {
    return error;
  }
};
