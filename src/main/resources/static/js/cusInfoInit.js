$(document).ready(function () {
    getScore();
})

$("#orderBtn").click(function () {
    $.ajax({
        method:"get",
        url:"/getMyOrders",
        success: function (result) {
            if (result!=null) {
                //将map得来的信息放在页面中
                $("#orderInfo").empty();
                var orderList = eval('(' + result + ')');
                for(var i=0;i<orderList.length;i++) {
                    var order = orderList[i];
                    var ul = $("<ul>");
                    var h4 = $("<h4>");
                    var li1 = $("<li>");
                    var li2 = $("<li>");
                    var li3 = $("<li>");
                    var li4 = $("<li>");
                    var li5 = $("<li>");
                    var span = $("<span>");
                    span.html("书籍信息");
                    h4.html("订单编号:"+(i+1));
                    li1.html("订单UID:"+order.orderUid);
                    li2.html("下单时间:"+order.time);
                    li3.html("地址:"+order.address);
                    li4.html("状态:"+order.state);
                    li5.html("总价格："+order.cart.totalPrice);
                    /*var bookStr = "";

                    $.each(bookList,function(index,book){
                        var a = $("<a>");
                        a.attr("href","/toSingle"+book.bookId);
                        a.html(book.name+",");
                        li5.append(a);
                    });
                    li5.append()
                    li5.after(span);*/
                    ul.append(h4);
                    ul.append(li1);
                    ul.append(li2);
                    ul.append(li3);
                    ul.append(li4);
                    ul.append(li5);
                    $("#orderInfo").append(ul);
                }

            } else {
                alert("未能获取订单信息！");
            }
        },
        error: function (e) {//响应不成功时返回的函数
            console.log(e, 'error');
        }
    })
})



function getScore() {
    $.ajax({
        method: "get",
        url:"/getMyBooksToBeScored",
        async:false,
        success: function (result) {
            if (result!=null) {
                //将map得来的信息放在页面中
                var bookList = result;
                console.log(result);
                $("#scoreDiv").empty();
                for(var i=0;i<bookList.length;i++) {
                    if(result[i]!=null) {
                        var ul1 = $("<ul>");
                        var li1 = $("<li>");
                        var li2 = $("<li>");
                        var li3 = $("<li>");
                        var btn = $("<button>");
                        var input = $("<input>");
                        var img = $("<img>");
                        var a = $("<a>");
                        a.attr("href", '/toSingle' + bookList[i].bookId);
                        img.attr("src", bookList[i].imgUrl);
                        btn.val(bookList[i].bookId);
                        a.html(bookList[i].name);
                        btn.html("评价");
                        input.attr("placeholder", "请输入你的评分，1-5");
                        li1.append(img);
                        li2.append(a);
                        ul1.append(li1);
                        ul1.append(li2);
                        li3.append(input);
                        li3.append(btn);
                        ul1.append(li3);
                        $("#scoreDiv").append(ul1);
                        addListenerForScoreBtn(btn);
                    }
                }
            } else {
                alert("未能获取订单信息！");
            }
        },
        error: function (e) {//响应不成功时返回的函数
            console.log(e, 'error');
        }
    })
}
function  addListenerForScoreBtn(btn) {
    btn.click(function () {
        //如果不是正浮点数
        var input = btn.prev().val();
        if (!(/(^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$)/.test(input))||Number(input)<0||Number(input)>5){
            alert("输入的评分无效！请重新输入");
        }
        else {
            $.ajax({
                method: "get",
                url: "/updateScore",
                data: {"bookId": btn.val(), "score": input},
                success: function (result) {
                    if (result != null) {
                        alert("评分成功");
                        btn.parent("ul").empty();
                    } else {
                        alert("评分失败！");
                    }
                }, error: function (e) {//响应不成功时返回的函数
                    console.log(e, 'error');
                }
            })
        }
    })
}