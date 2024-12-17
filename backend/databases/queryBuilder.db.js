import { tools } from "../functions.js";

const validOperators = {
    '=': '= ?',
    '!=': '!= ?',
    '<>': '<> ?',
    '<': '< ?',
    '<=': '<= ?',
    '>': '> ?',
    '>=': '>= ?',
    'IN': 'IN(_array)',
    'NOT IN': 'NOT IN(_array)',
    'BETWEEN': 'BETWEEN ? AND ?'
};
const validLogic = [ 'AND', 'OR' ];
const validFunctions = {
    'NOW': 'NOW()'
};

const queryBuilder = {
    query: [],
    values: [],
    select: function(table, columns = []) {
        if(tools.isStringEmpty(table))
            throw new Error('select err: No table in parameters');

        let select = 'SELECT ';

        if(!tools.isArrayEmpty(columns))
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

        select += ' FROM ' + table;
        this.query.push(select);
        return this;
    },
    where: function(filters) {
        if(tools.isObjectEmpty(filters))
            throw new Error('Filters must contains data');

        this.query.push('WHERE ' + this.buildWhereClause(filters));
        return this;
    },
    buildWhereClause: function(filters) {
        try
        {
            let conditions = [];

            const processFilter = (filter) => {
                if(!tools.isStringEmpty(filter.column) && !tools.isEmpty(filter.value))
                {
                    let [column, operator = '='] = filter.column.includes(':') ? filter.column.split(':') : [filter.column, '='];
                    let value = filter.value;
                    let sqlOperator = validOperators[operator.trim()];

                    if(tools.isStringEmpty(sqlOperator))
                        throw new Error(`Invalid operator: ${operator}`);

                    if(operator === 'IN' || operator === 'NOT IN')
                    {
                        if(!Array.isArray(value))
                            throw new Error('Value must be an array for IN / NOT IN operation');

                        let placeholders = value.map(() => '?').join(', ');
                        sqlOperator = sqlOperator.replace('_array', placeholders);

                        value.forEach(element => {
                            this.values.push(element);
                        });
                    }
                    else
                        this.values.push(value);

                    conditions.push(`${column} ${sqlOperator}`);
                }
                else if(!tools.isStringEmpty(filter.logic) && validLogic.includes(filter.logic.trim().toUpperCase()))
                    conditions.push(filter.logic.toUpperCase());
                else if(typeof filter.group !== 'undefined')
                {
                    const groupClause = queryBuilder.buildWhereClause(filter.group);
                    conditions.push(`(${groupClause})`);
                }
                else
                    throw new Error('Where build : Undefined or empty data');
            }

            filters.forEach((filter) => processFilter(filter));

            return conditions.join(' ');
        }
        catch(error)
        {
            console.error(error.stack);
        }
    },
    insert: function(table, data) {
        if(tools.isStringEmpty(table))
            throw new Error('Error in insertion: Empty table name');

        if(tools.isObjectEmpty(data))
            throw new Error('Error in insertion: Empty data');

        let insert = 'INSERT INTO ' + table + ' (';
        data.columns.forEach(column => {
            insert += column + ', ';
        });

        // Delete last coma
        insert = insert.substring(0, insert.length - 2) + ') VALUES' + this.buildInsertClause(data);
        this.query.push(insert);
        return this;
    },
    buildInsertClause: function (filters) {
        try
        {
            let insertValues = '';
            filters.values.forEach(rowValue => {
                insertValues += ' (';

                rowValue.forEach(value => {
                    if(!tools.isNumberInt(value) && value.includes('sql:') && value.replace('sql:', '') in validFunctions)
                        insertValues += validFunctions[value.replace('sql:', '')] + ', ';
                    else
                    {
                        insertValues += '?, ';
                        this.values.push(value);
                    }
                });

                // Delete last coma
                insertValues = insertValues.substring(0, insertValues.length - 2) + '),';
            });

            // Delete last coma
            insertValues = insertValues.substring(0, insertValues.length - 1);
            return insertValues;
        }
        catch(error)
        {
            console.error(error.stack);
        }

    },
    build: function() {
        let queryJoined = this.query.join(' ');

        // Debug only
        if(tools.strToBool(process.env.MYSQL_DEBUG))
        {
            let debug = queryJoined;
            this.values.forEach(value => {
                debug = debug.replace('?', typeof value === 'string' ? `"${value}"` : value);
            });

            tools.log(debug, 'sql', 'info');
        }

        const result = { query: queryJoined, values: [...this.values] };

        this.query = [];
        this.values = [];

        return result;
    }
}

export default queryBuilder;