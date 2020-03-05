const createResponse = require("../lib/utils");
const request = require("request");

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
    url: "url",
    headers: {
      "Content-Type": "application/json"
    }
  };
  return new Promise((resolve, reject) => {
    try {
      request(options, function(error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
        resolve(createResponse(200, response.body));
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
