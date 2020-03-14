const createResponse = require("../lib/utils");
const request = require("request");
const convert = require("xml-js");

module.exports.getBus = async (event, context) => {
  let url = "";
  try {
    let id = event.pathParameters.id;
    url = `http://ws.bus.go.kr/api/rest/stationinfo/getStationByUid?serviceKey=TDCAZK%2Fn5Rmxu7osH2pkL5ypuBxi9EG3dyZE4EMvV6i58cPKL8zYBqORz9mLAYbymU31%2FnXWy%2BO7CKDYIttf4w%3D%3D&arsId=${id}`;
  } catch (e) {
    return createResponse(500, {
      error: {
        message: `Bus 서버 이상 ${line}`
      }
    });
  }
  var options = {
    method: "GET",
    url: url,
    headers: {
      "Content-Type": "application/xml"
    }
  };
  return new Promise((resolve, reject) => {
    try {
      request(options, function(error, response) {
        if (error) throw new Error(error);
        let xmlToJson = convert.xml2json(response.body, {
          compact: true,
          spaces: 4
        });
        // console.log(xmlToJson);
        // console.log(response.body);
        resolve(createResponse(200, xmlToJson));
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
