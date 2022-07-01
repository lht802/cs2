$(function () {
    var UtilTools = new BetterUtilTools()
    var sysToken = 'SYS_TOKEN_EXP'
    //加密
    function btoa(str) {
        return window.btoa(str)
    }
    //解密
    function atob(str) {
        return window.atob(str)
    }
    function setToken(str) {
        var exp = 24*60*60*1000 //24小时过期
        document.cookie=sysToken+"="+str+"; expires="+new Date(new Date().getTime()+exp);
    }
    function getToken() {
        var cookie = document.cookie.split('; ');
        var json = {};
        for (let i = 0; i < cookie.length; i++){
            json[cookie[i].split('=')[0]]=cookie[i].split('=')[1]
        }
        return json[sysToken]
    }
    function transformJson(json) {
        var pJson = {}
        for (let k in json) {
            if (UtilTools.typeIs(json[k]) === 'string') {
                pJson[k] = btoa(json[k])
            }
        }
        return UtilTools.queryString(pJson)
    }
    var token = getToken();
    if (!token) {
        if (window.location.pathname != '/'){
            window.location.href='/'
        } else {
            $.get('../json/users.json', function (users) {
                $(document).on('click', '#but', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var user = $('#uname').val();
                    var pwd = $('#pwd').val();
                    for (var i = 0; i < users.length; i++){
                        var data = users[i];
                        if (data.user === user && data.pwd === pwd) {
                            setToken(data.user)
                            window.location.href = '/index1.html'
                            return false;
                        }
                    }
                    return alert('用户名或者密码错误')
                }).on('focus', '#password', function () {
                     // 密码框获得焦点，追加样式.password
                     $('#owl').addClass('password');
                }).on('blur', '#password', function () {
                     // 密码框失去焦点，移除样式.password
                     $('#owl').removeClass('password');
                })
            }) 
        }
    } else {
        var timer = setInterval(function () {
            var aLen = $('#main a').length;
            console.log(aLen)
            if (aLen) {
                $('a').each(function (i) {
                    var host = $(this).attr('href').split('?')[0]
                    var query = $(this).attr('href').split('?')[1]
                    if (query) {
                        var hrefJson = UtilTools.getUrlParams('http://www.baidu.com?' + query)
                        $(this).attr({ 'href':host+ '?' + transformJson(hrefJson)})
                    }
                }) 
                clearInterval(timer)
            }
            
        },10)
    }
})
