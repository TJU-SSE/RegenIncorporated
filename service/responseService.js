let pub = {};

pub.createErrResponse = function(err) {
    console.log(err);
    return {
        code: '1',
        err: err
    };
};

pub.createJSONResponse = function (data) {
    // let res = JSON.stringify(data);
    return {
        code: '0',
        msg: data
    };
};

pub.createAuthResponse = function () {
    return {
        code: '2',
        err: 'No Authority'
    }
};

module.exports = pub;
