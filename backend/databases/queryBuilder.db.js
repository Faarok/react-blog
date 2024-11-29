import moment from "moment";
import { tools } from "../functions.js";
import fs from 'fs';

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
const validFunctions = {
    'NOW': 'NOW()'
};

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
    where: function(filters) {
        if(typeof filters == 'undefined' || !filters || filters.length === 0)
            throw new Error('Filters must contains data');

        this.query.push('\nWHERE\n' + this.buildWhereClause(filters));
        return this;
    },
    buildWhereClause: function(filters) {
        try
        {
            let conditions = [];

            const processFilter = (filter) => {
                if(!tools.isStringEmpty(filter.column) && !tools.isStringEmpty(filter.value))
                {
                    let [column, operator = '='] = filter.column.includes(':') ? filter.column.split(':') : [filter.column, '='];
                    let value = filter.value;
                    let sqlOperator = validOperators[operator.trim()];

                    if(typeof sqlOperator === 'undefined')
                        throw new Error(`Invalid operator: ${operator}`);

                    let condition = '';
                    if(typeof conditions[conditions.length - 1] !== 'undefined')
                    {
                        if(!validLogic.some(word => conditions[conditions.length - 1].includes(word)))
                            condition += '\t';
                    }
                    else
                        condition += '\t';

                    condition += `${column} ${sqlOperator}\n`;

                    conditions.push(condition);
                    this.values.push(value);
                }
                else if(typeof filter.logic !== 'undefined' && validLogic.includes(filter.logic.trim().toUpperCase()))
                    conditions.push('\t' + filter.logic.toUpperCase());
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
        insert = insert.substring(0, insert.length - 2) + ')\nVALUES\n' + this.buildInsertClause(data);
        this.query.push(insert);
        return this;
    },
    buildInsertClause: function (filters) {
        try
        {
            let insertValues = '';
            filters.values.forEach(rowValue => {
                insertValues += '\t(';

                rowValue.forEach(value => {
                    if(value.includes('sql:') && value.replace('sql:', '') in validFunctions)
                        insertValues += validFunctions[value.replace('sql:', '')] + ', ';
                    else
                    {
                        insertValues += '?, ';
                        this.values.push(value);
                    }
                });

                // Delete last coma
                insertValues = insertValues.substring(0, insertValues.length - 2) + '),\n';
            });

            // Delete last coma
            insertValues = insertValues.substring(0, insertValues.length - 2);
            return insertValues;
        }
        catch(error)
        {
            console.error(error.stack);
        }

    },
    build: function() {
        let queryJoined = this.query.join(' ');

        // Debug only, see sql_debug.sql
        if(tools.strToBool(process.env.MYSQL_DEBUG))
        {
            let debug = queryJoined;
            this.values.forEach(value => {
                debug = debug.replace('?', typeof value === 'string' ? `"${value}"` : value);
            });

            fs.access('../sql_debug.log', fs.constants.F_OK, (error) => {
                if(error)
                {
                    fs.appendFile('sql_debug.log', moment().format('YYYY-MM-DD hh:mm:ss | ') + debug + '\n', (err) => {
                        if(err)
                            throw err;
                    });
                }
                else
                {
                    fs.writeFile('sql_debug.log', moment().format('YYYY-MM-DD hh:mm:ss | ') + debug + '\n', (err) => {
                        if(err)
                            throw err;
                    });
                }
            });
        }

        const result = { query: queryJoined, values: [...this.values] };

        this.query = [];
        this.values = [];

        return result;
    }
}

export default queryBuilder;