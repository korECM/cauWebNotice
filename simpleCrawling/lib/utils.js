const createResponse = (status, body) => {
  const result = {
    statusCode: status,
    body: JSON.stringify(body)
  };
  return result;
};

module.exports = createResponse;
