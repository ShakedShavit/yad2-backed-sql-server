const formatDayAndMonth = (num) => {
    if (`${num}`.length === 1) return "0" + num;
    return num;
};

const formatDateForSql = (dateOg) => {
    try {
        const date = new Date(dateOg);

        const year = date.getFullYear();
        const month = formatDayAndMonth(date.getMonth() + 1);
        const day = formatDayAndMonth(date.getDate());

        return `${year}-${month}-${day}`;
    } catch (err) {
        console.log("formatDateForSql func err:", err.msg, "date paramter input:", dateOg);
        return null;
    }
};

module.exports = formatDateForSql;
