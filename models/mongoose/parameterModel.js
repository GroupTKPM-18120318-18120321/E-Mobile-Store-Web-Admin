const mongoose = require('mongoose');
const Schema = mongoose.Schema();

const parameterSchema = mongoose.Schema({
    idParameterTable: { type: mongoose.Schema.Types.ObjectId, require: true, ref: 'ParameterTable' },
    parameterName: { type: String, require: true },
    type: { type: String, require: true },
    value: { type: String, require: true },
    state: { type: Boolean, require: true, default: true }
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

const parameterTableSchema = mongoose.Schema({

});

const formatConcurency = (concurency) => {
    let result = "";
    const arr = [];
    let tmp;
    if (concurency < 1000) {
        result = String(concurency);
    } else {
        do {
            tmp = concurency % 1000;
            if (tmp == 0) {
                arr.unshift("000");
            } else if (tmp < 10) {
                arr.unshift("00" + tmp);
            } else if (tmp < 100) {
                arr.unshift("0" + tmp);
            } else {
                arr.unshift(tmp);
            }
            //arr.unshift(tmp==0?"000":tmp);
            concurency = Math.floor(concurency / 1000);
        } while (concurency >= 1000);

        arr.unshift(concurency);

        for (let i = 0; i < arr.length; i++) {
            result += arr[i];
            result += i == arr.length - 1 ? "" : ".";
        }
    }

    return result;
}

parameterSchema.virtual('fvalue').get(function () {
    return formatConcurency(this.value);
});

const parameter = mongoose.model('Parameter', parameterSchema, "Parameter");
const parameterTable = mongoose.model('ParameterTable', parameterTableSchema, "ParameterTable");

module.exports = {
    parameterModel: parameter,
    parameterTableModel: parameterTable,
}
