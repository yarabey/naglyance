$(function () {
    var loginMode = true,
        $emailErr = $('.error.email'),
        $passErr = $('.error.pass');
    $('#loginSubmit,#loginCancel,#register').btn();
    $('#authPopup').click(function () {
        return false;
    });
    $('#loginSubmit').click(login);
    $('#register').click(toggleAuth);
    $('#email,#pass').keypress(function (e) {
        if (e.which == 13) {
            $('#loginSubmit').click();
        }
    });
    $('#email,#pass').focus(function () {
        $(this).removeClass('error-val');
        $(this).next().text('');
    });
    function toggleAuth() {
        $('#loginSubmit span').text(loginMode ? ' Зарегистрироваться и войти' : ' Войти');
        $(this).find('span').text(loginMode ? ' Вход' : ' Регистрация');
        $(this).find('i').toggleClass('icon-signin');
        $('#loginSubmit').unbind('click').click(loginMode ? register : login);
        loginMode = !loginMode;
        $('#email').focus();
    };
    function login() {
        sendPost('login', authCallback);
    };
    function register() {
        sendPost('register', authCallback);
    };
    function authCallback(data) {
        if (hasErrors(data))
            return;
        if (data.response.success) {
            window.location.reload();
            return;
        }
    };
    function sendPost(action, callback) {
        var data = {
            email: $('#email').val(),
            password: $('#pass').val()
        };
        var err = checkFields(data);
        if (err.email || err.password) {
            callback({ response: { err: err } });
            return;
        }
        $.ajax({
            url: '/home/auth/' + action,
            type: 'post',
            data: data,
            success: callback,
            error: function () {
                alert('Server error');
            }
        });
    };
    function checkFields(data) {
        var reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        var err = {
            email: '',
            password: ''
        };
        if (!data.email) {
            err.email = 'Введите Email';
        }
        else if (!reg.test(data.email)) {
            err.email = 'Неверный формат Email';
        }
        if (!data.password)
            err.password = 'Введите пароль';
        else if (!loginMode && data.password.length < 6)
            err.password = 'Минимальная длина - 6 символов';

        return err;
    };
    function hasErrors(data) {
        if (data.response.err) {
            $emailErr.text(data.response.err.email);
            $passErr.text(data.response.err.password);
            if (data.response.err.email)
                $('#email').addClass('error-val');
            if (data.response.err.password)
                $('#pass').addClass('error-val');
            return true;
        }
        return false;
    };
});
