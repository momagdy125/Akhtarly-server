exports.RemovingFieldsFromQuery = (query, fieldsToRemove) => {
  const modifiedQuery = { ...query };

  fieldsToRemove.forEach((field) => {
    delete modifiedQuery[field];
  });
  return modifiedQuery;
};
exports.querySupportComparisons = (query) => {
  //handel comparisons queries
  queryString = JSON.stringify(query);
  queryStringUpdated = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`
  );
  var advancedQuery = JSON.parse(queryStringUpdated);

  return advancedQuery;
};
exports.querySupportSubstring = (query, ...fieldsName) => {
  for (const field of fieldsName) {
    if (query[field]) {
      query[field] = { $regex: query[field], $options: "i" };
    }
  }

  return query;
};
exports.pagination = (request) => {
  const DefaultLimit = request.query.limit || 4;
  if (request.query.page) request.query.limit = DefaultLimit;
  return DefaultLimit;
};
