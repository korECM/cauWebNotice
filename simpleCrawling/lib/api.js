const request = require("request");
const cheerio = require("cheerio");
const createResponse = require("./utils");

function getArticle(params, db) {
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
        resolve(sendData);
      })
      .catch(error => {
        reject(error);
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
            reject({
              error: "crawling error"
            });
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
