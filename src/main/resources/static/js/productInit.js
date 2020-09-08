//初始化产品页面

//获取商品，使用ajax
//为了设置好页面的跳转，这里设置一个全局变量currentPage
var currentPage = 1;  //默认第一页
var currentMaxPage = 5;  //默认最大页数
var currentMinPage = 1;  //默认最小页数
var booksNumEveryPage = 12;
var defaultVisiblePageNum = 5;
var totalPageNum = 1; //默认页面总数


$(document).ready(function () {
    $.ajax({
        url:"/getAllBooks",
        method:"get",
        success: function (result) {
            console.log(result);
            if (result!=null) {
                initPage(result);
            } else {
                alert("未能获取书籍信息！");
            }
        }, error: function (e) {//响应不成功时返回的函数
            console.log(e, 'error');
        }
    })

    $.ajax({
        url:"/getPage1",
        method:"get",
        success: function (result) {
            console.log(result);
            if (result!=null) {
                showData(result);
            } else {
                alert("未能获取书籍信息！");
            }
        }, error: function (e) {//响应不成功时返回的函数
            console.log(e, 'error');
        }
    })
})

//本页面showData,使用js显示页面
function showData(data){
    $("#left").empty();
    $("#middle").empty();
    $("#right").empty();
    //下面是图片构成

    for(var i=0;i<data.length;i++) {
        var productDiv = $("<div>");
        var imgDiv = $("<div>");
        var a1 = $("<a>");
        var a2 = $("<a>");
        var img = $("<img>");
        var cartBtn = $("<a>");
        var buyBtn = $("<a>");
        var btnDiv = $("<div>");
        img.attr("src", data[i].imgUrl);
        img.attr("class", "col-md-12");
        a1.attr("href", "/toSingle"+data[i].bookId);
        a1.append(img);
        imgDiv.append(a1);
        //下面是标题和链接
        var h4 = $("<p>");
        a2.attr("href", "/toSingle"+data[i].bookId);
        var name = data[i].name;
        a2.html("《"+(name.length<9?name:(name.substring(0,9)+"......"))+"》");
        h4.append(a2);
        //下面是描述等
        var p1 = $("<p>");
        var p2 = $("<p>");
        var p3 = $("<p>");

        p1.html("&nbsp;&nbsp;&nbsp;&nbsp;"+data[i].description.substring(0,39)+"......");
        p2.html("￥"+data[i].price);
        var writer = data[i].writer;
        p3.html((writer.length<9?writer:(writer.substring(0,9)+"......")));
        //按钮
        cartBtn.html("加入购物车");
        buyBtn.html("立即购买");
        cartBtn.attr("class","btn btn-primary");
        //cartBtn.attr("value",data[i].bookId);
        buyBtn.attr("class","btn btn-primary");
        buyBtn.attr("href","/toCheckOne"+data[i].bookId);
        btnDiv.attr("class","dealBtn");
        btnDiv.append(buyBtn);
        btnDiv.append(cartBtn);
        //将所有的加入总div

        productDiv.append(imgDiv);
        productDiv.append(h4);
        productDiv.append(p3);
        productDiv.append(p1);
        productDiv.append(p2);
        productDiv.append(btnDiv);
        addListenerForCartBtn(cartBtn,data[i].bookId);
        //productDiv.append(buyBtn);
        //productDiv.append(cartBtn);
        if(i%3==0) {
            $("#left").append(productDiv);
        }
        else if(i%3==1) {
            $("#middle").append(productDiv);
        }
        else{
            $("#right").append(productDiv);
        }
    }
}

//页面初始化
function initPage(booksData) {
    var page1 = $("#pageUl li:eq(0)");
    console.log(booksData);
    var bookNum = booksData.length;
    //如果页数大于1
    //第二个判断条件用来防止多次点击而导致多次出现页面按钮
    if(bookNum>booksNumEveryPage&&totalPageNum==1){
        totalPageNum = parseInt(bookNum/booksNumEveryPage) + 1;
        //倒着添加，效果一样，比较巧妙
        for(var i=totalPageNum;i>=2;i--){
            var li = $("<li>");
            var a = $("<a>");
            a.html(i);
            a.attr("href","#");
            li.append(a);
            page1.after(li);
        }
    }
    //如果超出5页，则隐藏后面的
    if(bookNum>booksNumEveryPage*defaultVisiblePageNum){
        $("#pageUl li a").each(function () {
            if($(this).html()>defaultVisiblePageNum){
                $(this).hide();
            }
        })
    }
    addListenerForPage($("#pageUl li a"),booksData);
}

//为每个页面按钮设置监听器
function addListenerForPage(allPage,Data) {
    allPage.each(function () {
        $(this).click(function () {
            currentPage = $(this).html();
            var url = "/getPage"+currentPage;
            $.ajax({
                method:"get",
                url: url,
                success: function (result) {
                    console.log(result);
                    if (result!=null) {
                        showData(result);
                    } else {
                        alert("未能获取书籍信息！");
                    }
                }, error: function (e) {//响应不成功时返回的函数
                    console.log(e, 'error');
                }

            })
            //会是大于等于是因为跳转页面功能的实现,第三个判断条件是为了防止12345的时候点击1变成只有123
            //下面这个if是实现页面跳转，其实是多余的功能，可以全部显示出来，没有大碍。
            if(Number(currentPage)>=Number(currentMaxPage)||Number(currentPage)<=Number(currentMinPage)&&Number(currentPage)>3){
                allPage.each(function () {
                    var page = $(this);
                    var pageNum = $(this).html();
                    //如果每个a的页面值小于现在的页面-2
                    if(Number(pageNum) < Number(currentPage) - 2 || Number(pageNum) > Number(currentPage) + 2){
                        page.hide();
                    }
                    else
                        page.show();
                })
                //变化当前最大最小页
                currentMinPage = Number(currentPage)-2;
                currentMaxPage = Number(currentPage)+2;
            }
            //处理页码结束后处理显示
            showData(Data);
        });
    });
}

//为加入购物车按钮添加ajax请求
function addListenerForCartBtn(cartBtn,bookId) {
        var url = "/addBookToCart"+bookId;
        cartBtn.click(function () {
            $.ajax({
                url:url,
                method:"get",
                success: function (result) {
                    if (result.length!=0) {
                        //做一些加入购物车成功的动作，比如网页上的变化
                        var cart = eval('(' + result + ')');
                        $("#totalPrice").html(cart['totalPrice']);
                        $("#totalNum").html(cart['books'].length);

                    } else {
                        alert("加入购物车失败！请先登录！");
                        window.location.reload();
                        window.location = "/toLogin";
                    }
                }, error: function (e) {//响应不成功时返回的函数
                    console.log(e, 'error');
                }
            })
        })
}

$("#searchBtn").click(function () {
    $("#pageUl").empty();
    $.ajax({
        url:"/searchBooks",
        data:{"words":$("input[name='searchWords']").val()},
        method:"get",
        success: function (result) {
            if (result!=null) {
                showData(result);
            } else {
                alert("搜索结果为空！");
            }
        }, error: function (e) {//响应不成功时返回的函数
            console.log(e, 'error');
        }
    })
})