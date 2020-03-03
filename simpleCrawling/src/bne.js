const getArticle = require("../lib/api");
const { save, read } = require("../lib/db");
const Bne = require("../models/bne");

module.exports.saveNotice = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const response = await getArticle(
      [
        {
          url: "http://bne.cau.ac.kr/bneNews/notice/list.php",
          trSelector: "#content > div.bbsList > table > tbody > tr",
          dataFunc: $ => {
            console.log("object");
            const title = $(this)
              .find(".subject > a")
              .text();
            const link = `
            http://bne.cau.ac.kr/bneNews/notice/view.php?page=1&s_key=&s_word=&idx=${$(
              this
            )
              .find(".subject > a")
              .prop("href")
              .match(/\d+/)}`.trim();
            const date = $(this)
              .find("td:nth-child(6)")
              .text();
            return {
              title,
              link,
              date
            };
          }
        }
      ],
      save(Bne)
    );
    return response;
  } catch (error) {
    return error;
  }
};

module.exports.readNotice = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    response = await read(Bne);
    return response;
  } catch (error) {
    return error;
  }
};
