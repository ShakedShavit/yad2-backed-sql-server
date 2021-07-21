getUserByEmailQuery = (email) => {
  return `
        EXEC sp_get_user
        '${email}'
    `;
};

getUserByIdQuery = (id) => {
  return `
          EXEC sp_get_user_by_id
          '${id}'
      `;
};

module.exports = { getUserByEmailQuery, getUserByIdQuery };
