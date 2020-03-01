const cheerio = require("cheerio");
const request = require("request");

let url = "http://nursing.cau.ac.kr/life/notice_list.php";

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
      $("#contents > table > tbody > tr").each(function() {
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
