const request = require("request");
const cheerio = require("cheerio");
const getFood = require("../lib/fooddb");
const { save, read } = require("../lib/db");
const Food = require("../models/food");

const urlList = [
  "LTIzODExOTAw",
  "LTIzODAwOTc1",
  "LTIzODA5NzE5",
  "LTIzODA3NTM2",
  "MjIzMDk0MDAx",
  "MjMyNjY2NzA0"
];

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
let foodList = [];
let title = [];
let link = [];
let date = [];
let menuinfo = [];
let priceinfo = [];

module.exports.saveNotice = async (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let $;
  try {
    const response = await getFood(
      [
        {
          url:
            "https://bds.bablabs.com/restaurants/" +
            urlList[5] +
            "?campus_id=biV2tiK41v",
          trSelector:
            "#app > div.container-fluid > div > div > div.restaurant-item-wrapper > div > div.col-12.col-md-7.col-xl-8 > div:nth-child(1) > div.restaurant-item-menu > div > div > div:nth-child(1)",
          dataFunc: $ => {
            $("trSelector").each(function(i, e) {
              console.log("object");
              priceinfo[i] = $(this)
                .find(priceList[i])
                .text();
              menuinfo[i] = $(this)
                .find(
                  menuList[i]
                  // "div:nth-child(2) > div.card.card-menu > div > div.card-text"
                )
                .text();
              date[i] = $(this)
                .find("div.date-title")
                .text()
                .trim();
              title[i] = "일단 아무값";
              link[i] = "일단 아무값";
              //   console.log(`${priceinfo}`);
              //   console.log(`${menuinfo}`);
              //   foodList[i] = {
              //     title: title,
              //     link: link,
              //     date: date,
              //     priceinfo: priceinfo,
              //     menuinfo: menuinfo
              //   };
              //   console.log(foodList[i]);
            });

            const data = foodList.filter(n => n.title);
            // console.log(data);

            return {
              //   foodList
              title,
              link,
              date,
              priceinfo,
              menuinfo
            };
          }
        }
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
