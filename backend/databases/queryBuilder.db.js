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
    query: [],
    values: [],
    select: function(table, columns = []) {
        if(typeof table === 'undefined' || !table || table.length === 0)
            throw new Error('select err: No table in parameters');

        let select = 'SELECT ';

        if(columns.length !== 0)
        {
            for(let [column, alias] of Object.entries(columns))
            {
                if(Number.isInteger(alias))
                    select += `${column},`;
                else
                    select += `${column} AS '${alias}',`;
            }

            // Delete last coma
            select = select.substring(0, select.length - 1);
        }
        else
            select += '*';

        select += '\nFROM ' + table;
        this.query.push(select);
        return this;
    },
    where: function (filters) {
        if(typeof filters == 'undefined' || !filters || filters.length === 0)
            throw new Error('Filters must contains data');

        this.query.push('\nWHERE ' + this.buildWhereClause(filters));
        return this;
    },
    buildWhereClause: function (filters) {
        try
        {
            let conditions = [];

            const processFilter = (filter) => {
                if(
                    typeof filter.column !== 'undefined' && filter.column && filter.column.trim().length !== 0 && typeof filter.value !== 'undefined'
                )
                {
                    let [column, operator = '='] = filter.column.includes(':') ? filter.column.split(':') : [filter.column, '='];
                    let value = filter.value;
                    let sqlOperator = validOperators[operator.trim()];

                    if(typeof sqlOperator === 'undefined')
                        throw new Error(`Invalid operator: ${operator}`);

                    conditions.push(`${column} ${sqlOperator}`);
                    this.values.push(value);
                }
                else if(typeof filter.logic !== 'undefined' && validLogic.includes(filter.logic.trim().toUpperCase()))
                    conditions.push(filter.logic.toUpperCase());
                else if(typeof filter.group !== 'undefined')
                {
                    const groupClause = queryBuilder.buildWhereClause(filter.group);
                    conditions.push(`(${groupClause})`);
                }
            }

            filters.forEach((filter) => processFilter(filter));

            return conditions.join(' ');
        }
        catch(error)
        {
            console.error(error.stack);
        }
    },
    build: function () {
        return this.query.join(' ');
    }
}

export default queryBuilder;