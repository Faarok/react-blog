const validOperators = {
    '=': '= ?',
    '!=': '!= ?',
    '<>': '<> ?',
    '<': '< ?',
    '<=': '<= ?',
    '>': '> ?',
    '>=': '>= ?',
    'IN': 'IN(?)',
    'NOT IN': 'NOT IN(?)',
    'BETWEEN': 'BETWEEN ? AND ?'
};

const validLogic = [ 'AND', 'OR' ];

const queryBuilder = {
    where: (filters) => {
        try
        {
            // console.log(filters);
            let conditions = ['WHERE'];
            let values = [];

            const processFilter = (filter) => {
                // console.log(filter);
                if(
                    typeof filter.column !== 'undefined'
                    && typeof filter.operator !== 'undefined'
                    && typeof filter.value !== 'undefined'
                )
                {
                    let { column, operator, value } = filter;
                    let sqlOperator = validOperators[filter.operator.trim()];

                    if(typeof sqlOperator === 'undefined')
                        throw new Error(`Invalid operator: ${filter.operator}`);

                    conditions.push(`${filter.column} ${sqlOperator}`);
                    values.push(filter.value);
                }
                else if(typeof filter.logic !== 'undefined' && validLogic.includes(filter.logic.trim().toUpperCase()))
                    conditions.push(filter.logic.toUpperCase());
                else if(typeof filter.group !== 'undefined')
                {
                    const { clause: groupClause, params: groupValues } = queryBuilder.where(filter.group);
                    conditions.push(`(${groupClause})`);
                    values.push(...groupValues);
                }
            }

            filters.forEach((filter) => processFilter(filter));

            return {
                clause: conditions.join(' '),
                params: values
            };
        }
        catch(error)
        {
            console.error(error.stack);
        }
    }
}

export default queryBuilder;