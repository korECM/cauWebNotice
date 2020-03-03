const getArticle = require("../lib/api");

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
              .match(/\d+/)}`;
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
      null
    );
    return response;
  } catch (error) {
    return error;
  }
};
