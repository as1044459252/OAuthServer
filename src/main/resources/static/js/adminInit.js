/*
    文件上传的初始化，使用了插件bootstrap-fileinput
 */

function initFileInput(ctrlName) {
    var control = $('#' + ctrlName);
    control.fileinput({
        language: 'zh', //设置语言
        //uploadUrl: uploadUrl, //上传的地址
        allowedFileExtensions : ['jpg', 'png','gif'],//接收的文件后缀
        showUpload: true, //是否显示上传按钮
        showCaption: true,//是否显示标题
        browseClass: "btn btn-primary", //按钮样式
        previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
        dropZoneEnabled: false,
        showCaption: false,
        enctype: "multipart/form-data",
        autoOrientImage: false,

    });
}

//为了设置好页面的跳转，这里设置一个全局变量currentPage
var currentPage = 1;  //默认第一页
var currentMaxPage = 5;  //默认最大页数
var currentMinPage = 1;  //默认最小页数
var booksNumEveryPage = 10;
var defaultVisiblePageNum = 5;
var totalPageNum = 1; //默认页面总数

//查看全部按钮触发
$('#selectAll').click(function (){
    var books = getAll();
    initPage(books);
})

$('#selectAllOrders').click(function (){
    var orders = getAllOrders();
    initOrderPage(orders);
})

$('#selectAllUsers').click(function (){
    var users = getAllUsers();
    initUserPage(users);
})

function getAllUsers() {
    var users;
    $.ajax({
        type: 'post',
        url: '/getAllUsers',
        async: false,
        data: {"status": 1},    //用处？
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            console.log(result);
            if (result!=null) {
                result = eval('(' + result + ')');
                showUserData(result);
                users=result;
            } else {
                alert("未能获取书籍信息！");
            }
        }, error: function (e) {//响应不成功时返回的函数
            console.log(e, 'error');
        }
    })
    return users;
}

function getAllOrders() {
    var orders;
    $.ajax({
        type: 'post',
        url: '/getAllOrders',
        async: false,
        data: {"status": 1},    //用处？
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result!=null) {
                result = eval('(' + result + ')');
                showOrderData(result);
                orders=result;
            } else {
                alert("未能获取书籍信息！");
            }
        }, error: function (e) {//响应不成功时返回的函数
            console.log(e, 'error');
        }
    })
    return orders;
}


//获取所有书籍的请求，用于自动刷新和查看
function getAll() {
    var books;
    $.ajax({
        type: 'post',
        url: '/getAllBooks',
        async: false,
        data: {"status": 1},    //用处？
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (result!=null) {
                showData(result);
                books=result;
            } else {
                alert("未能获取书籍信息！");
            }
        }, error: function (e) {//响应不成功时返回的函数
            console.log(e, 'error');
        }
    })
    return books;
}


//搜索按钮触发
$('#searchBtn').click(function () {
    $.ajax({
        type: 'post',
        url: '/admin/searchBooks',
        data: {"words": $('#searchInput').val()},
        success: function (result) {
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

//删除按钮触发
$('#deleteBtn').click(function () {
    var numbers = new Array();
    var j = 0;
    //获取所有checkbox
    var checkboxs = document.getElementById("bookTable").getElementsByTagName('input');
    for(var i=0;i<checkboxs.length;i++){
        if(checkboxs[i].type=='checkbox'){
            if(checkboxs[i].checked==true){
                numbers[j] = checkboxs[i].value;
                j++;
            }
        }
    }
    //没有一个被选中
    if(j==0){
        alert("请至少选中一个书籍!")
        return;
    }

    $.ajax({
        type: 'post',
        url: '/admin/deleteBook',
        //下面这条是传数组必须的
        traditional: true,
        data: {"numbers": numbers},
        success: function (result) {
            if (result!=null) {
                var books = getAll();
                alert("删除成功！");
                showData(books);
            } else {
                alert("未能获取书籍信息！");
            }
        }, error: function (e) {//响应不成功时返回的函数
            console.log(e, 'error');
        }
    })
})


//修改按钮,获取checkbox
$('#updateBtn').click(function () {
    var number = 0;
    var checked = 0;
    //获取所有checkbox
    var checkboxs = document.getElementById("bookTable").getElementsByTagName('input');
    for(var i=0;i<checkboxs.length;i++){
        if(checkboxs[i].type=='checkbox'){
            if(checkboxs[i].checked==true){
                checked=i; //把选中的checkbox传给循环外面
                number++;
            }
        }
    }
    if(number<1)
        alert("请至少选中一本书籍！");
    if(number>1)
        alert("只能选择一本书籍进行修改！");
    //如果是合适的选择，就赋予form现在的值
    if(number==1) {
        $.ajax({
            type: 'post',
            url: '/admin/getCurrentBook',
            data: {"id": checkboxs[checked].value},    //用处？
            dataType : "json",
            success: function (result) {
                if (result!=null) {
                    //让输入栏显示当前书籍的信息
                    document.getElementsByName('updateBookName')[0].value=result.name;
                    document.getElementsByName('updateWriter')[0].value=result.writer;
                    document.getElementsByName('updateDescription')[0].value=result.description;
                    //图片不能设置value，在后台判断
                    //document.getElementsByName('updateImg')[0].value=result.imgUrl;
                    document.getElementsByName('updatePrice')[0].value=result.price;
                    document.getElementsByName('updateScore')[0].value=result.score;
                } else {
                    alert("未能获取书籍信息！");
                }
            }, error: function (e) {//响应不成功时返回的函数
                console.log(e, 'error');
            }
        })
        $('#updateBookModal').modal('show');
    }
})

//提交修改按钮，完成修改  **放弃了ajax请求


function showData(data) {
    var table = $('#bookTable tbody');
    var start = (Number(currentPage)-1)*booksNumEveryPage;
    var end = Number(currentPage)*booksNumEveryPage<data.length?(Number(currentPage))*booksNumEveryPage:data.length;
    table.empty();
    if(data.length>start) {
        for (; start < end; start++) {
            var str = "<tr><td>" + data[start].bookId +
                "</td><td>" + data[start].name +
                "</td><td>" + data[start].writer +
                "</td><td>" + data[start].description +
                "</td><td><img width='200px' height='200px' src=\"../" + data[start].imgUrl + "\">" +
                "</td><td>" + data[start].price +
                "</td><td>" + data[start].score +
                "</td><td><input type=\"checkbox\" value=\"" + data[start].bookId + "\">" +
                "</td></tr>";
            table.append(str);
        }
    }
}

function showOrderData(data) {
    var table = $('#orderTable tbody');
    var start = (Number(currentPage)-1)*booksNumEveryPage;
    var end = Number(currentPage)*booksNumEveryPage<data.length?(Number(currentPage))*booksNumEveryPage:data.length;
    table.empty();
    if(data.length>start) {
        for (; start < end; start++) {
            var str = "<tr><td>" + data[start].orderId +
                "</td><td>" + data[start].orderUid +
                "</td><td>" + data[start].cart.customerId +
                "</td><td>" + data[start].cart.books +
                "</td><td>" + data[start].time +
                "</td><td>" + data[start].cart.totalPrice +
                "</td><td><input type=\"checkbox\" value=\"" + data[start].orderId + "\">" +
                "</td></tr>";
            table.append(str);
        }
    }
}

function showUserData(data) {
    var table = $('#userTable tbody');
    var start = (Number(currentPage)-1)*booksNumEveryPage;
    var end = Number(currentPage)*booksNumEveryPage<data.length?(Number(currentPage))*booksNumEveryPage:data.length;
    table.empty();
    if(data.length>start) {
        for (; start < end; start++) {
            var str = "<tr><td>" + data[start].uid +
                "</td><td>" + data[start].username +
                "</td><td>" + data[start].password +
                "</td><td>" + data[start].tel +
                "</td><td>" + data[start].state +
                "</td><td>" + data[start].address +
                "</td><td><input type=\"checkbox\" value=\"" + data[start].uId + "\">" +
                "</td></tr>";
            table.append(str);
        }
    }
}

function initOrderPage(ordersData) {
    var page1 = $("#orderPageUl li:eq(0)");
    var orderNum = ordersData.length;
    //如果页数大于1
    //第二个判断条件用来防止多次点击而导致多次出现页面按钮
    if(orderNum>booksNumEveryPage&&totalPageNum==1){
        totalPageNum = parseInt(orderNum/booksNumEveryPage) + 1;
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
    if(orderNum>booksNumEveryPage*defaultVisiblePageNum){
        $("#orderPageUl li:eq(0)").each(function () {
            if($(this).html()>defaultVisiblePageNum){
                $(this).hide();
            }
        })
    }
    addListenerForPage($("#orderPageUl li a"),ordersData,'order');
}

function initUserPage(usersData) {
    var page1 = $("#userPageUl li:eq(0)");
    var userNum = usersData.length;
    //如果页数大于1
    //第二个判断条件用来防止多次点击而导致多次出现页面按钮
    if(userNum>booksNumEveryPage&&totalPageNum==1){
        totalPageNum = parseInt(userNum/booksNumEveryPage) + 1;
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
    if(userNum>booksNumEveryPage*defaultVisiblePageNum){
        $("#userPageUl li:eq(0)").each(function () {
            if($(this).html()>defaultVisiblePageNum){
                $(this).hide();
            }
        })
    }
    addListenerForPage($("#userPageUl li a"),usersData,'user');
}

//页面初始化
function initPage(booksData) {
    var page1 = $("#pageUl li:eq(0)");
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
    addListenerForPage($("#pageUl li a"),booksData,'book');
}

//为每个页面按钮设置监听器
function addListenerForPage(allPage,Data,option) {
    allPage.each(function () {
        $(this).click(function () {
            currentPage = $(this).html();
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
            if(option=='book')
            showData(Data);
            if(option=='user')
            showUserData(Data);
            if(option=='order')
            showOrderData(Data);

        });
    });
}







