const getArticle = require("../lib/api");

module.exports.notice = async (event, context, callback) => {
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
    callback
  );
};
