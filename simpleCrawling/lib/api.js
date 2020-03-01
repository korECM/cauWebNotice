const request = require("request");
const cheerio = require("cheerio");
const createResponse = require("./utils");

function getArticle(params, callback) {
  return new Promise((resolve, reject) => {
    let data = [];
    let jobs = params.map(logic => {
      const { url, trSelector, dataFunc } = logic;
      return new Promise((resolve, reject) => {
        request(url, (err, response, html) => {
          if (err) {
            console.error(err);
            callback(
              null,
              createResponse(200, {
                error: "crawling error"
              })
            );
            // callback(null, {
            //   statusCode: 200,
            //   body: JSON.stringify()
            // });
            reject();
          }
          let $ = cheerio.load(html);
          $(trSelector).each(function() {
            const temp = $(this);
            const transfer = () => {
              return temp;
            };
            data.push(dataFunc.call(this, transfer));
          });
          resolve();
        });
      });
    });
    Promise.all(jobs).then(() => {
      callback(
        null,
        createResponse(200, {
          data: data,
          error: null
        })
      );
      // callback(null, {
      //   statusCode: 200,
      //   body: JSON.stringify({
      //     data: data,
      //     error: null
      //   })
      // });
      resolve();
    });
  });
}

module.exports = getArticle;
