const getArticle = require("../lib/api");
const { save, read } = require("../lib/db");
const IctCAU = require("../models/ictCAU");
const createResponse = require("../lib/utils");

module.exports.saveNotice = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const response = await getArticle(
      [
        {
          url: "https://ict.cau.ac.kr/20150610/sub05/sub05_01_list.php",
          trSelector: "body > div > div.content > div > table > tbody > tr",
          dataFunc: $ => {
            const title = $(this)
              .find(".cont > a")
              .text();
            const link = `https://ict.cau.ac.kr/20150610/sub05/sub05_01_list.php?cmd=view&cpage=1&idx=${$(
              this
            )
              .find(".cont > a")
              .prop("href")
              .match(/\d+/)}&search_gbn=1&search_keyword=`;
            const date = $(this)
              .find("td:nth-child(3)")
              .text();
            return {
              title,
              link,
              date
            };
          }
        }
      ],
      save(IctCAU)
    );
    return response;
  } catch (error) {
    return error;
  }
};
module.exports.readNotice = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    response = await read(IctCAU);
    return response;
  } catch (error) {
    return error;
  }
};
