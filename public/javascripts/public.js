$(function () {
    //一级回复
    $(document).on('click','#reply_btn',function () {
        let url = $('.reply_talk').attr('name');
        let content = $('.reply_talk').val();
        $.ajax({
            type:'POST',
            url:url,
            data:$.param({content:content}),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).then(data=>{
            let addReply = $(this).closest('.allreply').siblings('.reply_content').find('.addReply');
            addReply.after(data).next('.re_content').find('.allreply').css('display','none').slideDown(500);
            $(this).closest('.allreply').find('.reply_talk').val('');
        }).catch(err=>{
            console.log(err);
        })
    })
    //评论框为空，评论按钮不能点击
    $(document).on('keyup','.markdown',function(event){
        let targetMarkdown = $(event.target);
        let targetForm = targetMarkdown.closest('.allreply');
        let targetBtn = targetForm.find('.commentBtn');
        if($(this).val().replace(/[&nbsp;\s+]/g,'').length <= 0){
            targetBtn.attr('disabled',true);
        }else{
            targetBtn.removeAttr('disabled');
        }
    })
    //二级回复
    $(document).on('click','.reply_btn',function (event) {
        let allreply = $(this).closest('.allreply');
        let url = allreply.find('input[name="url"]').val();
        let content = allreply.find('.markdown').val();
        let comment_target_id = allreply.find('.markdown').attr('name');
        let reply_id = allreply.find('input[name="target_id"]').val();
        let data= {
            content,
            comment_target_id,
            reply_id
        }
        $.ajax({
            type:'POST',
            url:url,
            data:$.param(data),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).then(data=>{
            $(this).closest('.allreply').siblings('#allComment').after(data).next('.comment').addClass('slideDown').css('display', 'none').slideDown(500);
            $(this).closest('.allreply').find('.reply_input').val('');
        }).catch(err=>{
            console.log(err);
        })
    })
    //二级回复回复对应的人
    $(document).on('click','.comment_btn',function (event) {
        let allreply = $(this).closest('.allreply');
        let url = allreply.find('input[name="url"]').val();
        let content = allreply.find('.comment_input').val();
        let comment_target_id = allreply.find('.comment_input').attr('name');
        let reply_id = allreply.find('input[name="target_id"]').val();
        let data= {
            content,
            comment_target_id,
            reply_id
        }
        $.ajax({
            type:'POST',
            url:`/question/${url}/comment`,
            data:$.param(data),
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).then(data=>{
            allreply.after(data).next('.comment').css('display', 'none').slideDown(500);
            allreply.find('.comment_input').val('');
        }).catch(err=>{
            console.log(err);
        })
    })
    $(document).on('click','.allCommentShow',function (event) {
        let targetA = $(event.target);
        let allComment = targetA.closest('.re_content');
        let reply_id = allComment.find('input[name="allComment"]').val();
        let off = $(this).attr('target');
        $.ajax({
            type:'GET',
            url:`/${reply_id}/allComment`
        }).then(data=>{
            if(off == 'true'){
                $(this).siblings('.showAllComment').html(data);
                $(this).siblings('.showAllComment').slideDown(1000);
                allComment.find('.slideDown').slideUp(500);
                $(this).attr('target','false');
            }else{
                $(this).siblings('.showAllComment').slideUp(1000);
                $(this).attr('target','true');
            }

        }).catch(err=>{
            console.log(err);
        })
    })
    //文章点赞
    $(document).on('click','.weibo-btn-like',function (event) {
        let targetA = $(event.target);
        let wbContent = targetA.closest('.weibo-content')
        let question_id = wbContent.find('input[name="question_id"]').val();
        $.ajax({
            type:'POST',
            url:`/${question_id}/question_likes`,
        }).then(data=>{
            if(data > 0){
                $(this).html('<i class="fa fa-thumbs-up"></i>\n' + data);
            }else{
                $(this).html('<i class="fa fa-thumbs-up"></i>\n赞');
            }
        }).catch(err=>{
            console.log(err);x
        })
    })
    $(document).on('click','.reply_like',function (event) {
        let targetA = $(event.target);
        let reContent = targetA.closest('.re_content');
        let reply_id = reContent.find('input[name="target_id"]').val();
        $.ajax({
            type:'POST',
            url:`/${reply_id}/reply_likes`,
        }).then(data=>{
            if(data > 0){
                $(this).html('<i class="fa fa-thumbs-o-up"></i>\n' + data)
            }else{
                $(this).html('<i class="fa fa-thumbs-o-up"></i>\n赞')
            }
        }).catch(err=>{
            console.log(err);
        })
    })
    $(document).on('click','.comment_likes',function (event) {
        let targetA = $(event.target);
        let cmContent = targetA.closest('.comment');
        let comment_id = cmContent.find('input[name="comment_id"]').val();
        $.ajax({
            type:'POST',
            url:`/${comment_id}/comment_likes`,
        }).then(data=>{
            if(data > 0){
                $(this).html('<i class="fa fa-thumbs-o-up"></i>\n' + data)
            }else{
                $(this).html('<i class="fa fa-thumbs-o-up"></i>\n赞')
            }
        }).catch(err=>{
            console.log(err);
        })
    })
    $(document).on('click','.weibo-btn-reply_reply',function (event) {
        let off = $(this).attr('target');
            let targetA = $(event.target);
            let targetContent = targetA.closest('.weibo-content');
            let id = targetContent.find('input[name="question_id"]').val();
            $.ajax({
                type:'GET',
                url:`/${id}/sectionReply`,
                headers:{'Content-Type':'application/x-www-form-urlencoded'}
            }).then(data=>{
                if(off == 'true'){
                    targetContent.find('.showSectionReply').html(data);
                    targetContent.find('.showSectionReply').slideDown();
                    targetContent.find('.message_re_content').slideUp();
                    targetContent.find('.forWard_div').slideUp(400);
                    targetContent.find('.forWard_div').attr('target', 'true');
                    $(this).attr('target','false');
                }else{
                    $(this).attr('target','true');
                    $(this).closest('.weibo-content-btn').siblings('.showSectionReply').slideUp();
                    targetContent.find('.message_re_content').slideDown();
                }
            }).catch(err=>{
                console.log(err);
            })
    })
    $(document).on('click','.reply_slide',function (event) {
        let targetA = $(event.target);
        let SlContent = $(this).closest('.re_input').siblings('.slide_reply');
        let off = SlContent.attr('target');
        if(off == 'true'){
            SlContent.slideDown(500);
            SlContent.attr('target','false');
        }else{
            SlContent.slideUp(500);
            SlContent.attr('target','true');
        }
    })
    $(document).on('click','.comment_slide',function (event) {
        let targetA = $(event.target);
        let SlContent = $(this).closest('.co_input').siblings('.slide_comment');
        let off = SlContent.attr('target');
        if(off == 'true'){
            SlContent.slideDown(500);
            SlContent.attr('target','false');

        }else{
            SlContent.slideUp(500);
            SlContent.attr('target','true');
        }
    })
    $(document).on('click','.weibo-btn-mark',function (event) {
        let questionId = $(this).closest('.weibo-content').find('input[name="question_id"]').val();
        $.ajax({
            type:'post',
            url:`/${questionId}/followWeibo`,
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).then(data=>{
            if (data.message == 'followed') {
                $(this).html('<i class="fa fa-star"></i>\n取消收藏');
            }else if(data.message == 'unfollow') {
                $(this).html('<i class="fa fa-star"></i>\n收藏');
            }
            console.log(data);
        }).catch(err=>{
            console.log(err);
        })
    })
    let distance;
    $(document).scroll(function(){   //页面加载时，获取滚动条初始高度
        distance = $(document).scrollTop();  //获取滚动条初始高度的值 ：0
    })
    $(document).on('mouseover', '.weibo-picture li img', function (e) {
        var xx = e.originalEvent.x || e.originalEvent.layerX || 0;
        var yy = e.originalEvent.y || e.originalEvent.layerY || 0;
        var scroll = document.body.clientHeight - document.body.scrollTop
        var boardDiv = "<div class='boardDiv'><\/div>";
        $(document.body).append(boardDiv);
        $('.boardDiv').attr('style', 'background-image:url("/upload/photos/' + $(this).attr('src').substring(20) + '");background-size:100% 100%')
        $('.boardDiv').addClass('boardDiv');
        $('.boardDiv').css({top: yy + distance - 150, left: xx + 150});
    }).on('mouseout', '.weibo-picture li img', function (e) {
        $('.boardDiv').remove();
    });
    $(document).on('click','.forWard',function () {
        let off = $(this).closest('.weibo-content').find('.forWard_div').attr('target');
        if(off == 'true'){
            $(this).closest('.weibo-content').find('.forWard_div').slideDown(400);
            $(this).closest('.weibo-content').find('.showSectionReply').slideUp();
            $(this).siblings('.weibo-btn-reply_reply').attr('target', 'true');
            $(this).closest('.weibo-content').find('.forWard_div').attr('target', 'false');
        }else{
            $(this).closest('.weibo-content').find('.forWard_div').slideUp(400);
            $(this).closest('.weibo-content').find('.forWard_div').attr('target', 'true');
        }
    })
    $(document).on('click','.forward_btn ',function () {
        let question_id = $(this).closest('.weibo-content').find('input[name="question_id"]').val();
        let content = $(this).closest('.weibo-content').find('.forWard_div').find('.forWard_input').val();
        $.ajax({
            type:'post',
            url:`/${question_id}/forWard`,
            data:{content:content},
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        }).then(data=>{
            if(data.message = 'success'){
                window.location.replace('/');
            }
        }).catch(err=>{
            console.log(err);
        })
    })
    $(document).on('click', '#search-btn', function (e) {
        let key = $('#search').val();
        if (key) {
            $.ajax({
                type: 'POST',
                url: `/search/${key}`,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(data => {
                console.log(data)
                $('.content').html(data)
            })
        } else {
            alert('关键词内容不能为空');
        }
    })

})
