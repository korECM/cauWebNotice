const createResponse = require("../lib/utils");
const request = require("request");
const cheerio = require("cheerio");

module.exports.getSubwayFirstLast = async (event, context) => {
  let url = "";
  try {
    var line = event.pathParameters.id;
    if (line === "7")
      url =
        "https://m.search.naver.com/search.naver?sm=top_hty&fbm=0&ie=utf8&query=%EC%83%81%EB%8F%84%EC%97%AD";
    else if (line === "9")
      url =
        "https://m.search.naver.com/search.naver?sm=mtb_hty.top&where=m&oquery=%EC%83%81%EB%8F%84%EC%97%AD&tqi=UEBXbdp0JxCssU%2B8n80ssssstVR-482726&query=%ED%9D%91%EC%84%9D%EC%97%AD";
    else {
      throw new Error(`지하철 호선 이상함 ${line}`);
    }
  } catch (e) {
    return createResponse(500, {
      error: {
        message: `Subway 서버 이상 ${line}`
      }
    });
  }
  return new Promise((resolve, reject) => {
    try {
      request(url, function(error, response) {
        if (error) throw new Error(error);
        let $ = cheerio.load(response.body);
        let totalResult = [];
        $(".time_table._fl_tab_content").each(function(index, element) {
          let results = [[], [], [], []];
          let flag = true;
          $(this)
            .find("tbody > tr")
            .each(function(index, element) {
              // 처음에 첫차 있으므로 true로 먼저 설정
              if (
                $(this)
                  .find("th")
                  .text().length > 0
              ) {
                flag = !flag;
              }
              let offset = 0;
              if (flag) {
                offset = 2;
              } else {
                offset = 0;
              }
              $(this)
                .find("td")
                .each(function(index, element) {
                  if (index === 0) {
                    $(this)
                      .find("div > div")
                      .each(function(index, element) {
                        results[0 + offset].push(
                          $(this)
                            .text()
                            .trim()
                        );
                      });
                  } else {
                    $(this)
                      .find("div > div")
                      .each(function(index, element) {
                        results[1 + offset].push(
                          $(this)
                            .text()
                            .trim()
                        );
                      });
                  }
                });
            });
          // results = results.filter(data => data.length > 0);
          totalResult.push(results);
        });
        console.log(totalResult);
        // resolve(totalResult);
        // resolve(createResponse(200, response.body));
        resolve(createResponse(200, totalResult));
      });
    } catch (error) {
      resolve(
        createResponse(500, {
          error: {
            message: "API 서버 호출 실패",
            error
          }
        })
      );
    }
  });
};

module.exports.getSubway = async (event, context) => {
  let url = "";
  try {
    var line = event.pathParameters.id;
    if (line === "7") {
      url =
        "http://swopenapi.seoul.go.kr/api/subway/566e7a474e6a65663131387256736642/json/realtimeStationArrival/0/5/%EC%83%81%EB%8F%84(%EC%A4%91%EC%95%99%EB%8C%80%EC%95%9E)";
    } else if (line === "9") {
      url =
        "http://swopenapi.seoul.go.kr/api/subway/566e7a474e6a65663131387256736642/json/realtimeStationArrival/0/5/%ED%9D%91%EC%84%9D";
    } else {
      throw new Error(`지하철 호선 이상함 ${line}`);
    }
  } catch (e) {
    return createResponse(500, {
      error: {
        message: `Subway 서버 이상 ${line}`
      }
    });
  }
  var options = {
    method: "GET",
    url: url,
    headers: {
      "Content-Type": "application/json"
    }
  };
  return new Promise((resolve, reject) => {
    let temp;
    try {
      request(options, function(error, response) {
        if (error) throw new Error(error);
        temp = response.body;
        try {
          let obj = JSON.parse(response.body);
          Object.keys(obj).forEach(element => {
            if (typeof obj[element] === "string" && obj[element].length === 0)
              delete obj[element];
          });
          resolve(createResponse(200, obj));
        } catch (error) {
          throw new Error(response.body);
        }
      });
    } catch (error) {
      console.error(error);
      console.error(temp);
      resolve(
        createResponse(500, {
          error: {
            message: "API 서버 호출 실패",
            error
          }
        })
      );
    }
  });
};
