const SessionRepository = require('../orm/repository/sessionRepository');
const ResponseService = require('../service/responseService');

function checkIfAllow(request) {

    if (request.path.split('/')[1] === 'admin' && request.method == 'POST') {
        return false;
    }
    return true;
}

var checkAuthority = function () {

    return async (ctx, next) => {

        if(checkIfAllow(ctx.request)) {
            await next();
        }
        else {
            var id = ctx.cookies.get('sessionId');
            let session = await SessionRepository.findOne({id: id});
            if(session == null) {
                ctx.response.body = ResponseService.createAuthResponse();
            }
            else {
                await next();
            }
        }
    };
};

module.exports = checkAuthority;
