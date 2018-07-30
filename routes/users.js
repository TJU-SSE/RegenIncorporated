const router = require('koa-router')();
const UserRepository = require('../orm/repository/userRepository');
const SessionRepository = require('../orm/repository/sessionRepository');
const ResponseService = require('../service/responseService');

// pre URL
router.prefix('/user');


router.get('/logout', async (ctx, next) => {
    try {
        await ctx.cookies.set('sessionId', '');
        ctx.response.body = ResponseService.createJSONResponse('Logout Successfully');
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

router.post('/test', async (ctx, next) => {
    ctx.response.body = ResponseService.createJSONResponse();
});

router.get('/test', async (ctx, next) => {
    ctx.response.body = ResponseService.createJSONResponse();
});


router.post('/login', async (ctx, next) => {
    try {
        let username = ctx.request.body.username || '';
        let password = ctx.request.body.password || '';
        let user = await UserRepository.findOne({'username': username, 'password': password});
        if(user) {
            let session = await SessionRepository.findOne({'username': username});
            await ctx.cookies.set('sessionId', session.get('id'));
            ctx.response.body = ResponseService.createJSONResponse('Login Successfully');
        }
        else {
            ctx.response.body = ResponseService.createErrResponse('Login error');
        }
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

router.post('/register', async (ctx, next) => {
    try {
        let username = ctx.request.body.fields.username || '';
        let password = ctx.request.body.fields.password || '';
        let user = await UserRepository.findOne({'username': username});
        if(user) {
            ctx.response.body = ResponseService.createErrResponse('Username used');
        }
        else {
            await UserRepository.create(username, password);
            let session = await SessionRepository.create(username, username);
            await ctx.cookies.set('sessionId', session.get('id'));
            ctx.response.body = ResponseService.createJSONResponse('Register Successfully');
        }
    } catch(e) {
        ctx.response.body = ResponseService.createErrResponse(e);
    }
});

module.exports = router;
