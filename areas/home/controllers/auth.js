// Home: Controller
var dbprovider = require('dbprovider'),
    pass = require('password');

exports.postLogin = function(context){
    dbprovider.executeStoredScript("users_getByEmail", context.data.email, function(err, user) {
        if (err) {
            context.send({ err: { password: 'Временная проблема с базой данных' } });
            return;
        }
        if (user) {
            if (pass.check(context.data.password, user.password)) {
                context.session.user = user;
                context.send({ success: true });
                return;
            }
            context.send({ err: { password: 'Неверный пароль' } });
        }
        else {
            context.send({ err: { email: 'Пользователь с таким Email не найден' } });
        }
    });
}

exports.postRegister = function(context) {
    dbprovider.executeStoredScript("users_isInDB", { email: context.data.email }, function(err, count) {
        console.log(err);
        if (count) {
            context.send({ err: { email: 'Введённый Email уже используется' } });
            return;
        }
        var hash = pass.createHash(context.data.password);
        dbprovider.executeStoredScript("users_add", { password: hash, email: context.data.email }, function(err, user) {
            console.log(err);
            if (!err) {
                if (!err && user) {
                    console.log(user);
                    context.session.user = user;
                    context.send({ success: true });
                    return;
                }
                context.send({ err: { password: 'Временная проблема с базой данных' } });
            }
            else {
                context.send({ err: { password: 'Временная проблема с базой данных' } });
            }
        });
    });
}

exports.postLogOut = function(context) {
    context.session.user = null;
    context.send();
}

exports.info = function(){
    return {
        permissions: {all: false, role:"admin"},
        actions: {
            "postLogin": {model:"auth", data: {body: true}, validationRedirect: 'home', responseFormat: 'json'},
            "postRegister": {model:"auth", data: {body: true}, validationRedirect: 'home', responseFormat: 'json'},
            "postLogOut": {responseFormat: 'json'}
        }
    };
};
