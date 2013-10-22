exports.getDefault = function(context){
    context.send({ title: 'НаГлянце.рф - Контакты' });
};

exports.info = function(){
    return {
        permissions: {all: false, role:"admin"},
        actions: {
            "getDefault": {}
        }
    };
};

