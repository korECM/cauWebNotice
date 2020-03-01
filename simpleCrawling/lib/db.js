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
      useFindAndModify: false
    })
    .then(conn => {
      connection = conn;
      return connection;
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
    try {
      if (typeof str === "string") {
        var { data } = JSON.parse(str);
      } else if (typeof str === "object") {
        var data = str.data;
      } else {
        reject(
          createResponse(500, {
            message: "DB에 저장하려는 데이터가 이상합니다",
            error
          })
        );
        return;
      }
    } catch (error) {
      reject(
        createResponse(500, {
          message: "DB에 저장하려는 데이터가 이상합니다",
          error
        })
      );
      return;
    }
    if (!data || typeof data !== "object" || data.length == 0) {
      reject(
        createResponse(500, {
          message: "DB에 저장하려는 데이터가 이상합니다"
        })
      );
      return;
    }
    if (
      !data[0].hasOwnProperty("title") ||
      !data[0].hasOwnProperty("link") ||
      !data[0].hasOwnProperty("date")
    ) {
      reject(
        createResponse(500, {
          message: "DB에 저장하려는 데이터가 이상합니다"
        })
      );
      return;
    }
    if (typeof Type["findOneAndUpdate"] !== "function") {
      reject(
        createResponse(500, {
          message: "DB Type이 이상합니다"
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
                createResponse(500, { message: "DB Update 실패", error: e })
              );
            });
        });
        resolve(createResponse(200, { message: "Success" }));
      })
      .catch(e => {
        console.log("DB 접속 실패");
        reject(createResponse(500, { message: "DB 접속 실패", error: e }));
      });
  });
};

const read = (Type, cb, select = "-_id title link date") => {
  return new Promise((resolve, reject) => {
    connect()
      .then(() =>
        Type.find()
          .select(select)
          .lean()
          .exec()
      )
      .then(datas => {
        if (datas === "undefined" || datas.length === 0) {
          throw e;
        } else {
          cb(null, createResponse(200, datas));
          resolve(createResponse(200, datas));
        }
      })
      .catch(e => {
        reject(createResponse(500, { message: "DB 데이터 오류" }));
        cb(null, createResponse(200, datas));
      });
  });
};

// module.exports = connect;
module.exports.save = save;
module.exports.read = read;
