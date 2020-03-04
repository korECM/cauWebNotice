const createResponse = (status, body) => {
  const result = {
    statusCode: status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(body)
  };
  return result;
};

module.exports = createResponse;
