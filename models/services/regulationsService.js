const parametersModel = require('../mongoose/parameterModel');

exports.setValueWithType = async (type, value) => {
    if (type === "Number"){
        return Number(value);
    } else {
        console.log("Invalid")
    }
}

exports.format = (value) => {
    let result="";
    const arr=[];
    let tmp;
    if (value < 1000){
        result = String(value);
    } else {
        do{
            tmp = value % 1000;
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
            value = Math.floor(value / 1000);
        } while (value >= 1000);
        
        arr.unshift(value);

        for(let i=0;i<arr.length;i++){
            result+=arr[i];
            result += i==arr.length-1 ? "" :".";
        }       
    }
    
    return result;
}

exports.getListParameters = async () => {
    let parameters = await parametersModel.parameterModel.find();

    // for (p of parameters){
    //     p.add({fvalue: this.format(p.value)});
    // }

    return parameters;
}

exports.editRegulation = async (req, res, next) => {
    const data = {
        parameterName: req.body.parameterName,
        value: req.body.value,
        state: req.body.state
    }

    await parametersModel.parameterModel.findByIdAndUpdate(req.body.parameterID, data, { new: true });
}