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

exports.limitingFields = (req) => {
  let fields = "";
  if (req.query.fields) fields = req.query.fields.split(",").join(" ");
  return fields;
};

exports.basicQueryProcess = (req) => {
  var Query = querySupportComparisons(req.query);

  Query = querySupportSubstring(Query, "cpu");

  Query = RemovingFieldsFromQuery(Query, ["limit", "sort", "page", "fields"]);

  const DefaultLimit = pagination(req);

  let fields = limitingFields(req);
  return { Query, DefaultLimit, fields };
};
