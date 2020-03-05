const getArticle = require("../lib/api");
const { save, read } = require("../lib/db");
const Nurse = require("../models/nurse");

module.exports.saveNotice = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return getArticle(
    [
      {
        url: "http://nursing.cau.ac.kr/life/notice_list.php",
        trSelector: "#contents > table > tbody > tr",
        dataFunc: $ => {
          const title = $(this)
            .find(".subject > a")
            .text();
          const date = $(this)
            .find(".date")
            .text();
          const link =
            "http://nursing.cau.ac.kr/life/" +
            $(this)
              .find(".subject > a")
              .prop("href");
          return {
            title,
            link,
            date
          };
        }
      }
    ],
    save(Nurse)
  );
};

module.exports.readNotice = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    response = await read(Nurse);
    return response;
  } catch (error) {
    return error;
  }
};
