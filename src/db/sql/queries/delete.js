const deleteTokenQuery = (token) => {
    return `
        EXEC sp_delete_token '${token}'
    `;
};

module.exports = { deleteTokenQuery };
