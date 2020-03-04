const getArticle = require("../lib/api");
const { save, read } = require("../lib/db");
const Coe = require("../models/coe");

module.exports.saveNotice = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const response = await getArticle(
      [
        {
          url: "http://coe.cau.ac.kr/sub/sub04_01.php",
          trSelector:
            "#contentArea > div.real-cont > div > div.board-list > table > tbody > tr",
          dataFunc: $ => {
            const title = $(this)
              .find(".subject > a")
              .text();
            const link = `http://coe.cau.ac.kr${$(this)
              .find(".subject > a")
              .prop("href")}`;
            const date = $(this)
              .find(".date")
              .text();
            return {
              title,
              link,
              date
            };
          }
        }
      ],
      save(Coe)
    );
    return response;
  } catch (error) {
    return error;
  }
};
module.exports.readNotice = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    response = await read(Coe);
    return response;
  } catch (error) {
    return error;
  }
};
