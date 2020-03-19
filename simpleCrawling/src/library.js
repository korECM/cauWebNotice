const createResponse = require("../lib/utils");
const request = require("request");

module.exports.getLibrary = async (event, context) => {
  try {
    var id = event.pathParameters.id;
    if (id < 1 || id > 3) throw new Error();
  } catch (e) {
    return createResponse(500, {
      error: {
        message: `라이브러리 서버 이상 ${id}`
      }
    });
  }
  console.log("id", id);
  var options = {
    method: "POST",
    url: "https://mportal.cau.ac.kr/portlet/p017/p017.ajax",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ tabNo: `${id}` })
  };
  return new Promise((resolve, reject) => {
    try {
      request(options, function(error, response) {
        if (error) throw new Error(error);
        let obj = JSON.parse(response.body);
        // 왜 줄이면 resource size는 줄어드는데 transfer는 늘어나는 걸까나
        obj.gridData = obj.gridData.map(e => {
          return {
            rN: e.roomName,
            tC: e.totalCnt,
            uC: e.useCnt,
            rC: e.remainCnt
          };
        });
        console.log(obj.gridData);
        resolve(createResponse(200, obj.gridData));
      });
    } catch (error) {
      resolve(
        createResponse(500, {
          error: {
            message: "API 서버 호출 실패"
          }
        })
      );
    }
  });
};
