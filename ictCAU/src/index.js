const cheerio = require("cheerio");
const request = require("request");

let url = "https://ict.cau.ac.kr/20150610/sub05/sub05_01_list.php";
module.exports.notice = async (event, context, callback) => {
  return new Promise((resolve, reject) => {
    request(url, (err, response, html) => {
      if (err) {
        console.error(err);
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            error: "crawling error"
          })
        });
        reject();
      }
      let $ = cheerio.load(html);
      let data = [];
      $("body > div > div.content > div > table > tbody > tr").each(function() {
        const title = $(this)
          .find(".cont > a")
          .text();
        const link = `https://ict.cau.ac.kr/20150610/sub05/sub05_01_list.php?cmd=view&cpage=1&idx=${$(
          this
        )
          .find(".cont > a")
          .prop("href")}&search_gbn=1&search_keyword=`;

        const date = $(this)
          .find("td:nth-child(3)")
          .text();
        data.push({
          title: title,
          link: link,
          date: date
        });
      });
      console.log(
        JSON.stringify({
          data: data,
          error: null
        })
      );
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          data: data,
          error: null
        })
      });
      resolve();
    });
  });
};
