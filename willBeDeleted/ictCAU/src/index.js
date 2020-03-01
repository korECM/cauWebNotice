const cheerio = require("cheerio");
const request = require("request");

let url = "https://ict.cau.ac.kr/20150610/sub05/sub05_01_list.php";

module.exports.notice = async (event, context, callback) => {
  return getArticle(
    url,
    "body > div > div.content > div > table > tbody > tr",
    $ => {
      const title = $.find(".cont > a").text();
      const link = `https://ict.cau.ac.kr/20150610/sub05/sub05_01_list.php?cmd=view&cpage=1&idx=${$.find(
        ".cont > a"
      ).prop("href")}&search_gbn=1&search_keyword=`;
      const date = $.find("td:nth-child(3)").text();
      return {
        title,
        link,
        date
      };
    },
    callback
  );
};
