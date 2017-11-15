//注册
const registerApp = angular.module('registerApp',[]);
registerApp.controller('registerController',($scope,$http)=>{
    $scope.formData = {};
    $scope.postForm = ()=>{
        //发送一个POST请求，用来提交用户注册的信息
        $http({
            method:'POST',//发送的方式
            url:'/register',//发送的地址
            data:$.param($scope.formData), //发送的数据
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).then(data=>{
            if(data.data.message == 'success'){
                //成功了
                $scope.success = '注册成功,5秒后跳转,请注意查收邮件';
                $('#successbox').fadeIn();
                setTimeout(function(){
                    window.location.href = '/login';
                },5000)
            }else{
                //失败了
                $scope.error  = data.data ;//返回的失败信息
                $('#errorbox').fadeIn();
                setTimeout(function(){
                    $('#errorbox').fadeOut();
                },1000)
            }
        }).catch(err=>{
            console.log(err);//失败以后调用的代码
        })
    }
})
//登录
const loginApp = angular.module('loginApp',[]);
loginApp.controller('loginController',($scope,$http)=>{
    $scope.formData = {};
    //提交用户的登录信息
    $scope.postForm = ()=>{
        $http({
            method:'POST',
            url:'/login',
            data:$.param($scope.formData),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).then(data=>{
            if(data.data == 'success'){
                window.location.href = '/';
            }else{
                $scope.error = data.data;
                $('#errorbox').fadeIn();
                setTimeout(()=>{
                    $('#errorbox').fadeOut();
                },1000)
            }
        }).catch(err=>{
            console.log(err);
        })
    }
})
//个人设置
const settingApp = angular.module('settingApp',[]);
settingApp.controller('settingController',($scope,$http)=>{
    $scope.formData = {
        motto: $('input[name=motto]').val(),
        avatar: $('input[name=avatar]').attr('target'),
        xm:$('input[name=xm]').val(),
        job:$('input[name=job]').val()
    }
    $("#avatar").fileinput({
        overwriteInitial: true,
        uploadUrl:'/updateImage',
        maxFileSize: 2000,
        showClose: false,
        showCaption: false,
        showBrowse: false,
        browseOnZoneClick: true,
        removeLabel:'',
        removeIcon:'<i class="glyphicon glyphicon-remove"></i>',
        removeClass:'btn btn-danger',
        removeTitle:"取消或重置更改",
        uploadLabel:'',
        uploadClass:'btn btn-success',
        uploadIcon:'<i class="glyphicon glyphicon-arrow-up"></i>',
        msgErrorClass:'alert alert-block alert-danger',
        elErrorContainer:'kv-avatar-errors-2',
        layoutTemplates:{main2:'{preview}' + '{browse}'},
        language: "zh",
        allowedFileExtensions: ["jpg", "png"],
        defaultPreviewContent:'<img src="' + $('#avatar').attr('target') + '">'
    }).on('fileuploaded',function(event,data,previewId,index){
        $scope.formData.avatar = data.response.url.replace('public','');
    });
    $scope.postForm = ()=>{
        $http({
            method:'POST',
            url:'/updateUser/' + $('.form_setting').attr('id'),
            data:$.param($scope.formData),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).then(data=>{
            if(data.data = 'success'){
                window.location.reload();
            }else{
                alert(data.data);
            }
        }).catch(err=>{
            console.log(err);
        })
    }
})
//主页
const indexApp = angular.module('indexApp', []);
indexApp.controller('indexController',($scope,$http)=>{
    $scope.formData={}
    let photos = [];
    $('textarea').each(function () {
        this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    }).on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    $('#photo').click(function () {
        if ($('.kv-avatar').attr('target') == 'true') {
            $('.kv-avatar').removeClass('hide');
            $('.kv-avatar').attr('target', 'false');
        } else {
            $('.kv-avatar').addClass('hide');
            $('.kv-avatar').attr('target', 'true');
        }
    });
    $("#updatePhoto").fileinput({
        overwriteInitial: true,
        uploadUrl: '/updatePhoto',
        maxFileSize: 2000,
        showClose: false,
        showCaption: false,
        showBrowse: false,
        browseOnZoneClick: true,
        removeLabel: '',
        removeIcon: '<i class="glyphicon glyphicon-remove"></i>',
        removeClass: 'btn btn-danger',
        removeTitle: "取消或重置更改",
        uploadLabel: '',
        uploadClass: 'btn btn-success',
        uploadIcon: '<i class="glyphicon glyphicon-arrow-up"></i>',
        msgErrorClass: 'alert alert-block alert-danger',
        elErrorContainer: 'kv-avatar-errors-2',
        layoutTemplates: {main2: '{preview}' + '{browse}'},
        language: "zh",
        allowedFileExtensions: ["jpg", "png", "gif"],
        defaultPreviewContent: '点击插入图片'
    }).on('fileuploaded', function (event, data, previewId, index) {
        $scope.formData.updatePhoto = data.response.url.replace('public', '');
        photos.push($scope.formData.updatePhoto)
    });
    $scope.postForm = ()=>{
        $scope.formData.content=$('textarea[name="content"]').val()
        $scope.formData.photos = JSON.stringify(photos);
        $http({
            method: 'POST',
            url: '/create',
            data: $.param($scope.formData),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).then(data=>{
            if(data.data  = 'success'){
                window.location.href = "/";
            }
        }).catch(err=>{
            console.log(err);
        })
    }
})
// center
const centerApp = angular.module('centerApp', []);
centerApp.controller('centerController',($scope,$http)=>{
    $scope.followUser = ()=>{
        let name = $('#followUser').attr('data-followUser');
        $http({
            method:'post',
            url:`/center/${name}/followUser`,
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).then(data=>{
            console.log(data);
        })
    }
})
// read_reply
const messageApp = angular.module('messageApp',[]);
messageApp.controller('messageController',($scope,$http)=>{
    $scope.read_reply = () =>{
        let userId = $('#replyP').attr('read_reply');
        $http({
            method:'post',
            url:`message/${userId}/read_reply`,
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).then(data=>{
        })
    }
    $scope.read_comment = () =>{
        let userId = $('#replyP').attr('read_reply');
        $http({
            method: 'post',
            url: `message/${userId}/read_comment`,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(data=>{

        })
    }
    $scope.read_at = () =>{
        let userId = $('#replyP').attr('read_reply');
        $http({
            method: 'post',
            url: `message/${userId}/read_at`,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(data=>{

        })
    }
    $scope.read_like = () =>{
        let userId = $('#replyP').attr('read_reply');
        $http({
            method: 'post',
            url: `message/${userId}/read_like`,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(data=>{

        })
    }
})