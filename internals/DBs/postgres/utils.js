const buildWhereClause = (filters = []) => {
    
    const whereClauses = [];
    const values = [];

    filters.forEach(({ key, value, filterType = "=" }, idx) => {
        if (key !== undefined && value !== undefined) {
            whereClauses.push(  filterType === "like" ?  `${key} ILIKE $${++idx}` : `${key} = $${++idx}`);
            values.push( filterType === "like" ? `%${value}%` : value);
        }
    });

    const whereClause = whereClauses.join(' AND ');

    return { whereClause, values };
}



module.exports = {
    buildWhereClause
}