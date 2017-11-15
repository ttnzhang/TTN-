;(function($){
    $(function(){
        //表情解析
        $.fn.extend({
            replaceface : function(){
                var faces=$(this).html();
                for(i=0;i<60;i++){
                    var reg=new RegExp('\\['+(i+1)+']','g');
                    faces=faces.replace(reg,'<img src="../images/face/'+(i+1)+'.gif">');
                }
                $(this).html(faces);
            }
        });
        $('.weibo-text').each(function(event){
            $(this).replaceface();
        });
        $('.reply_pre').each(function(event){
            $(this).replaceface();
        });
        // 光标定位插件
        $.fn.extend({
            "insert":function(value){
                //默认参数
                value=$.extend({
                    "text":"123"
                },value);
                var dthis = $(this)[0]; //将jQuery对象转换为DOM元素
                //IE下
                if(document.selection){
                    $(dthis).focus();		//输入元素textara获取焦点
                    var fus = document.selection.createRange();//获取光标位置
                    fus.text = value.text;	//在光标位置插入值
                    $(dthis).focus();	///输入元素textara获取焦点
                }
                //火狐下标准
                else if(dthis.selectionStart || dthis.selectionStart == '0'){
                    var start = dthis.selectionStart;
                    var end = dthis.selectionEnd;
                    var top = dthis.scrollTop;
                    //以下这句，应该是在焦点之前，和焦点之后的位置，中间插入我们传入的值
                    dthis.value = dthis.value.substring(0, start) + value.text + dthis.value.substring(end, dthis.value.length);
                }
                //在输入元素textara没有定位光标的情况
                else{
                    this.value += value.text;
                    this.focus();
                };
                return $(this);
            }
        });

        //创建图片上传预览
        // var addPic="<li><input type='file' name='talkPic' class='addPicBtn' accept='.jpg,.jpeg,.png'><span class='PicClose'>×</span><img src='images/addPic.png'/></li>";
        // var picLength=0;
        // $(".home_content_edit").append("<div id='addPic'><ul>"+addPic+"</ul></div>");
        //
        // $("#addPic").change(function(event){
        //     if(event.target.className=="addPicBtn"){
        //         var filename = event.target.value;
        //         var mime = filename.toLowerCase().substr(filename.lastIndexOf("."));
        //         if(mime!=".jpg"&&mime!=".jpeg"&&mime!=".png")
        //         {
        //             $('#myModal').modal({
        //                 keyboard: false
        //             })
        //             event.target.outerHTML=event.target.outerHTML;
        //         }else{
        //             $("#addPic").find("p").remove();
        //             var objUrl = getObjectURL(event.target.files[0]) ;
        //             if (objUrl) {
        //                 $(event.target).parents("li").find("img").attr("src", objUrl);
        //                 $(event.target).attr("style","display: none;");
        //                 if($("#addPic ul li").length<9){
        //                     $("#addPic ul").append(addPic);
        //                 }
        //
        //                 if($("#addPic ul li:last-child img").attr("src")=="images/addPic.png"){
        //                     picLength=$("#addPic ul li").length-1;
        //                 }else{
        //                     picLength=$("#addPic ul li").length;
        //
        //                 }
        //                 $("#addPic").append("<p>已选"+picLength+"张，最多选择9张图片</p>");
        //             }
        //             if($(event.target).parents("li").find("img").attr("src")!="images/addPic.png"){
        //                 $(event.target).parents("li").find("span").attr("style","display: inline;");
        //             }
        //         }
        //     }
        // })
        // $("#addPic").click(function(event){
        //     if(event.target.className=="PicClose"){
        //         $("#addPic").find("p").remove();
        //         $(event.target).parents("li").remove();
        //         if($("#addPic ul li:last-child img").attr("src")!="images/addPic.png"){
        //             $("#addPic ul").append(addPic);
        //             picLength=$("#addPic ul li").length;
        //         }else{
        //             picLength=$("#addPic ul li").length-1;
        //         }
        //         $("#addPic").append("<p>已选"+picLength+"张，最多选择9张图片</p>");
        //     }
        // })

        //建立一个可读取的url
        function getObjectURL(file) {
            var url = null ;
            if (window.createObjectURL!=undefined) { // basic
                url = window.createObjectURL(file) ;
            } else if (window.URL!=undefined) { // mozilla(firefox)
                url = window.URL.createObjectURL(file) ;
            } else if (window.webkitURL!=undefined) { // webkit or chrome
                url = window.webkitURL.createObjectURL(file) ;
            }
            return url ;
        }
        //表情按钮，图片按钮
        $(document).on('click','.glyphicon-picture',function(){
            $("#addPic").slideToggle(150);
        });
        var faceTarget = false;
        $(document).on('click','.glyphicon-piggy-bank',function(){
            if (event.target.className=="glyphicon glyphicon-piggy-bank") {
                //创建表情框
                var faceimg = '';
                var $this=$(event.target);
                for(i=0;i<60;i++){
                    faceimg+='<li><a href="javascript:void(0)"><img src="../images/face/'+(i+1)+'.gif" title="['+(i+1)+']"/></a></li>';
                };
                $this.parent().prepend("<div class='faceBox'><span class='Corner'></span><div class='Content'>"+
                    "<h3><span>表情</span><a class='close' title='关闭'>×</a></h3><ul>"+faceimg+"</ul></div></div>");
                //插入表情
                var $facepic = $(".faceBox li img");
                $facepic.on("click",function(){
                    //文本框内光标定位
                    $this.prev(".talk").insert({"text":$(this).attr("title")});
                    $this.prev(".reply_talk").insert({"text":$(this).attr("title")});
                });
                $(".faceBox").attr("style","display: block;");
                $(".faceBox a.close").on("click",function(){
                    $(this).parents(".faceBox").remove();
                });
            }
        });
        //动态字数限制
        $("textarea.talk").on("keydown",function(event){
            $(this).prev("p").text("剩余字数："+(140-$(this).val().length));
            if ($(this).val().length>=140&&event.keyCode!=8) {
                return false;
            }
        })
        $("textarea.talk").on("keyup",function(event){
            $(this).prev("p").text("剩余字数："+(140-$(this).val().length));
        })
    });
})(jQuery)
