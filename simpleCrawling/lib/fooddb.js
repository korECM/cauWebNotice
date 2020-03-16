const request = require("request");
const cheerio = require("cheerio");
const createResponse = require("./utils");

function getFood(params, db) {
  return new Promise((resolve, reject) => {
    if (db === null) {
      db = data => {
        return Promise.resolve(createResponse(200, data));
      };
    }
    getFoodCrawling(params)
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

function getFoodCrawling(params) {
  return new Promise((resolve, reject) => {
    let data = [];
    let jobs = params.map(logic => {
      const { url, trSelector, dataFunc } = logic;
      return new Promise((resolve, reject) => {
        request(url, (err, response, html) => {
          if (err) {
            console.error(err);
            reject({
              error: { message: "crawling error" }
            });
          }
          let $ = cheerio.load(html);
          if ($(trSelector).length == 0) {
            console.error("선택된 tr 요소가 없습니다");
            reject({
              error: {
                message: "선택된 tr 요소가 없습니다"
              }
            });
          }
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

module.exports = getFood;
