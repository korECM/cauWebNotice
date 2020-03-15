const request = require("request");
const cheerio = require("cheerio");
const getArticle = require("../lib/api");
const { save, read } = require("../lib/db");
const Food = require("../models/food");

// const urlList = [
//   "LTIzODExOTAw",
//   "LTIzODAwOTc1",
//   "LTIzODA5NzE5",
//   "LTIzODA3NTM2",
//   "MjIzMDk0MDAx",
//   "MjMyNjY2NzA0"
// ];

const menuList = [
  "div:nth-child(2) > div.card.card-menu > div > div.card-text",
  "div:nth-child(3) > div:nth-child(2) > div > div.card-text",
  "div:nth-child(3) > div:nth-child(3) > div > div.card-text",
  "div:nth-child(4) > div:nth-child(2) > div > div.card-text",
  "div:nth-child(4) > div:nth-child(3) > div > div.card-text"
];

const priceList = [
  "div:nth-child(2) > div.card.card-menu > div > div.card-title",
  "div:nth-child(3) > div:nth-child(2) > div > div.card-title",
  "div:nth-child(3) > div:nth-child(3) > div > div.card-title",
  "div:nth-child(4) > div:nth-child(2) > div > div.card-title",
  "div:nth-child(4) > div:nth-child(3) > div > div.card-title"
];

module.exports.saveNotice = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const response = await getArticle(
      [
        priceList.map(i => ({
          url:
            "https://bds.bablabs.com/restaurants/" +
            urlList[5] +
            "?campus_id=biV2tiK41v",
          trSelector:
            "#app > div.container-fluid > div > div > div.restaurant-item-wrapper > div > div.col-12.col-md-7.col-xl-8 > div:nth-child(1) > div.restaurant-item-menu > div > div > div:nth-child(1)",
          dataFunc: $ => {
            console.log("object");
            const priceinfo = $(this)
              .find(
                priceList[i]
                // "div:nth-child(2) > div.card.card-menu > div > div.card-title"
              )
              .text();
            const menuinfo = $(this)
              .find(
                menuList[i]
                // "div:nth-child(2) > div.card.card-menu > div > div.card-text"
              )
              .text();
            const date = $(this)
              .find("div.date-title")
              .text()
              .trim();
            const title = "일단 아무값";
            const link = "일단 아무값";
            // console.log(`${date}`);
            return {
              title,
              link,
              date,
              priceinfo,
              menuinfo
            };
          }
        }))
      ],
      save(Food)
    );
    return response;
  } catch (error) {
    return error;
  }
};

module.exports.readNotice = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    response = await read(Food);
    return response;
  } catch (error) {
    return error;
  }
};
