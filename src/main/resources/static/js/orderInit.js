//初始化结算页面



function orderInit() {
    $(".value-plus").each(function () {
        addListenerForUpBtn($(this));
    });
    $(".value-minus").each(function () {
        addListenerForDownBtn($(this));
    });
}

function addListenerForUpBtn(upBtn){
    upBtn.click(function() {
        $.ajax({
            type: 'get',
            url: '/bookNumPlus',
            data: {"bookId": upBtn.attr("value")},
            success: function (result) {
                if (result!=null) {
                    var cart = eval('(' + result + ')');
                    var bookNumDiv = upBtn.prev();
                    var bookNum = Number(bookNumDiv.html());
                    bookNumDiv.html(Number(bookNum+1));
                    $("#checkPrice").html(cart.totalPrice);
                    $("#totalPrice").html(cart.totalPrice);
                } else {
                    alert("操作失败！");
                }
            }, error: function (e) {//响应不成功时返回的函数
                console.log(e, 'error');
            }
        })
    })
}

function addListenerForDownBtn(downBtn){
    var bookNumDiv = downBtn.next();

        downBtn.click(function () {
            if (Number(bookNumDiv.html()) > 1) {
                $.ajax({
                    type: 'get',
                    url: '/bookNumMinus',
                    data: {"bookId": downBtn.attr("value")},
                    success: function (result) {
                        console.log(result);
                        if (result != null) {
                            var cart = eval('(' + result + ')');
                            var bookNum = Number(bookNumDiv.html());
                            bookNumDiv.html(Number(bookNum - 1));
                            $("#checkPrice").html(cart.totalPrice);
                            $("#totalPrice").html(cart.totalPrice);
                            console.log(cart['totalPrice']);
                        } else {
                            alert("操作失败！");
                        }
                    }, error: function (e) {//响应不成功时返回的函数
                        console.log(e, 'error');
                    }
                })
            }

            else {
                alert("书籍数量不能小于1！");
            }
        })

}

