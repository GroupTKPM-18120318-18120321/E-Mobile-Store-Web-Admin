const mongoose= require('mongoose');
const Schema = mongoose.Schema();

const parameterSchema = mongoose.Schema({
    idParameterTable: {type: mongoose.Schema.Types.ObjectId, require: true, ref: 'ParameterTable'},
    parameterName: {type: String, require: true},
    type: {type: String, require: true},
    value: {type: String, require: true},
    state: {type: Boolean, require: true, default: true}
},{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

const parameterTableSchema = mongoose.Schema({

});

const parameter = mongoose.model('Parameter', parameterSchema, "Parameter" );
const parameterTable = mongoose.model('ParameterTable', parameterTableSchema, "ParameterTable" );

module.exports = {
    parameterModel: parameter,
    ParameterTableModel: parameterTable,
}
