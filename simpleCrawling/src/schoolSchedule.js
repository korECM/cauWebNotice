const qs = require("querystring");
const axios = require("axios");
const createResponse = require("../lib/utils");

module.exports.getSchoolSchedule = async (event, context) => {
  try {
    var id = event.pathParameters.id;
    if (id < 2000) throw new Error();
  } catch (e) {
    return createResponse(500, {
      error: {
        message: `Schedule 서버 이상 ${id}`
      }
    });
  }
  console.log("id", id);

  return new Promise((resolve, reject) => {
    try {
      axios
        .post(
          `https://www.cau.ac.kr/ajax/FR_SCH_SVC/ScheduleListData.do`,
          qs.stringify({
            SCH_YEAR: `${id}`,
            SCH_SITE_NO: `${2}`
          })
        )
        .then(response => {
          resolve(createResponse(200, { data: response.data.data }));
        })
        .catch(error => {
          throw error;
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

function callAPI(year, siteNo = 2) {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `https://www.cau.ac.kr/ajax/FR_SCH_SVC/ScheduleListData.do`,
        qs.stringify({
          SCH_YEAR: `${year}`,
          SCH_SITE_NO: `${siteNo}`
        })
      )
      .then(response => {
        resolve(response.data.data);
      })
      .catch(error => {
        throw error;
      });
  });
}
