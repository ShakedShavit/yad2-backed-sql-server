const optionalStr = (str) => (!!str ? `'${str}'` : `NULL`);

module.exports = { optionalStr };
