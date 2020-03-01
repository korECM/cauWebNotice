const request = require("request");
const cheerio = require("cheerio");
const createResponse = require("./utils");

function getArticle(params, db, cb) {
  return new Promise((resolve, reject) => {
    if (db === null) {
      db = data => {
        return Promise.resolve(createResponse(200, data));
      };
    }
    getArticleCrawling(params)
      .then(data => {
        return db(data);
      })
      .then(sendData => {
        cb(null, sendData);
        resolve();
      })
      .catch(error => {
        cb(error);
        reject();
      });
  });
}

function getArticleCrawling(params) {
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
      resolve({ data });
    });
  });
}

module.exports = getArticle;
