const mongoose = require("mongoose");
const createResponse = require("./utils");
let connection = null;

const connect = () => {
  if (connection && mongoose.connection.readyState === 1)
    return Promise.resolve(connection);
  return mongoose
    .connect("mongodb://cau:cauisthebest@13.209.15.24:27017/cauDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      serverSelectionTimeoutMS: 3000,
      reconnectTries: 5,
      reconnectInterval: 500
    })
    .then(conn => {
      connection = conn;
      return connection;
    })
    .catch(error => {
      throw error;
    });
};

const save = Type => {
  return str => {
    return _save(str, Type);
  };
};

const _save = (str, Type) => {
  return new Promise((resolve, reject) => {
    console.log("저장 시작");
    console.log(str);
    try {
      if (typeof str === "string") {
        var { data } = JSON.parse(str);
      } else if (typeof str === "object") {
        var data = str.data;
      } else {
        reject(
          createResponse(500, {
            error: {
              message: "DB에 저장하려는 데이터가 이상합니다"
            }
          })
        );
        return;
      }
    } catch (error) {
      reject(
        createResponse(500, {
          error: {
            message: "DB에 저장하려는 데이터가 이상합니다"
          }
        })
      );
      return;
    }
    if (!data || typeof data !== "object" || data.length == 0) {
      reject(
        createResponse(500, {
          error: {
            message: "DB에 저장하려는 데이터가 이상합니다"
          }
        })
      );
      return;
    }
    if (
      !data[0].hasOwnProperty("title") ||
      !data[0].hasOwnProperty("link") ||
      // !data[0].hasOwnProperty("priceinfo") ||
      // !data[0].hasOwnProperty("menuinfo") ||
      !data[0].hasOwnProperty("date")
    ) {
      reject(
        createResponse(500, {
          error: {
            message: "DB에 저장하려는 데이터가 이상합니다"
          }
        })
      );
      return;
    }
    if (typeof Type["findOneAndUpdate"] !== "function") {
      reject(
        createResponse(500, {
          error: {
            message: "DB Type이 이상합니다"
          }
        })
      );
      return;
    }
    connect()
      .then(() => {
        console.log("Connected to DB");
        data.map(objectData => {
          Type.findOneAndUpdate(
            {
              title: objectData.title
            },
            objectData,
            { new: true }
          )
            .exec()
            .then(data => {
              if (!data) {
                const model = new Type(objectData);
                return model.save();
              }
              console.log(data);
            })
            .catch(e => {
              console.error("Update 실패", e);
              reject(
                createResponse(500, {
                  error: {
                    message: "DB Update 실패"
                  },
                  error: e
                })
              );
            });
        });
        resolve(createResponse(200, { message: "Success" }));
      })
      .catch(e => {
        console.log("DB 접속 실패");
        reject(createResponse(500, { error: { message: "DB 접속 실패" } }));
      });
  });
};

const read = (Type, select = "-_id title link date") => {
  return new Promise((resolveFunction, reject) => {
    connect()
      .then(() => {
        console.log("DB Connected");
        return Type.find()
          .select(select)
          .lean()
          .exec();
      })
      .then(datas => {
        if (datas === "undefined" || datas.length === 0) {
          reject(
            createResponse(500, { error: { message: "받아온 데이터가 없음" } })
          );
        } else {
          resolveFunction(createResponse(200, datas));
        }
      })
      .catch(e => {
        console.error("db 접속 오류 from read");
        console.log(e);
        reject(createResponse(500, { error: { message: "DB 접속 오류" } }));
      });
  });
};

module.exports.save = save;
module.exports.read = read;
