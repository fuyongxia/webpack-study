import fecha from 'fecha';
import lodash from 'lodash';

export default {
    dateFormat(date, format = 'YYYY-MM-DD HH:mm:ss') {
        if (date) {
            return fecha.format(date, format);
        }
        return '————';
    },

    denormalize(array, options) {
        options = lodash.merge({
            id: 'id',
            pid: 'pid',
            root: { id: 0 },
            children: 'children',
            transform: lodash.cloneDeep
        }, options);
    
        const { id, pid, root, children, transform } = options;
    
        const parse = (array, root) => {
            for (let i=0; i<array.length; i++) {
                let item = array[i];
                if (root[id] == item[pid]) {
                    if (!root[children]) {
                        root[children] = []
                    }
                    root[children].push(parse(array, item))
                }
            }
            return root;
        }
    
        return parse(array.map(transform), root);
    },

    strength(password) {
        const kinds = [
            /\d+/,
            /[a-zA-Z]+/,
            /((?=[\x21-\x7e]+)[^A-Za-z0-9])/
        ];
        const lengthPoints = 1 - Math.pow(Math.E, -(password.length * 0.2));

        let kindPoints = 0;
        kinds.reduce((sum, kind) => {
            sum += kind.test(password) ? 1 : 0;
        }, kindPoints);

        kindPoints = kindPoints / kinds.length;

        return Math.floor(kindPoints * 30 + lengthPoints * 70);
    },

    convertTo(value, unit) {
        const base = 1024;
        const number = lodash.toNumber(value);

        if (!lodash.isNumber(number) || value < base) {
            return value + unit.slice(1);
        }

        let n = ' KMGTP'.indexOf(unit[0]);
        if (!n) {
            n = Math.floor(Math.log(number) / Math.log(base));
        }
        return (number / Math.pow(base, n)).toFixed(2) + ['', 'K', 'M', 'G', 'T', 'P'][n] + unit.slice(1);
    }
}