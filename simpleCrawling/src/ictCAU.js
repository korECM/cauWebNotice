const getArticle = require("../lib/api");
const { save, read } = require("../lib/db");
const IctCAU = require("../models/ictCAU");

module.exports.saveNotice = async (event, context, callback) => {
  return getArticle(
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
    save(IctCAU),
    callback
  );
};
module.exports.readNotice = async (event, context, callback) => {
  return read(IctCAU, callback);

  read()
};
