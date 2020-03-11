//"jquery", "jquery-cookie"  可以直接通过一个形参去接受
define(["parabola", "jquery", "jquery-cookie"], function(parabola, $){
    //下载数据，加载到页面上
    function download(){
        sc_num();
        $.ajax({
            type: "get",
            url: "../data/data.json",
            success: function(arr){
                    //通过循环，将数据添加到页面上
                    for(var i = 0; i < arr.length; i++){
                        var node = $(`<li class="goods_item">
                        <div class="goods_pic">
                            <img src="${arr[i].img}" alt="">
                        </div>
                        <div class="goods_title">
                            <p>【京东超市】奥利奥软点小草莓</p>
                        </div>
                        <div class="sc">
                            <div id="${arr[i].id}" class="sc_btn">加入购物车</div>
                        </div>
                    </li>`);
                        node.appendTo(".goods_box ul");
                    }
            },
            error: function(msg){
                    console.log(msg);
            }
        })
    }

    //加入购物车操作，通过事件委托
    function addToCart(){
        $(".goods_box ul").on("click", ".sc_btn", function(){
            var id = this.id;
            //判断是否是第一次
            var first = $.cookie("goods") == null ? true : false;
            if(first){
                //是第一次
                var arr = [{id:id,num:1}];
                $.cookie("goods", JSON.stringify(arr), {
                    expires: 7
                })
            }else{
                //判断之前是否添加
                var cookieStr = $.cookie("goods");
                var cookieArr = JSON.parse(cookieStr);
                var same = false; //假设没有添加过
                for(var i = 0; i < cookieArr.length; i++){
                    if(cookieArr[i].id == id){
                        cookieArr[i].num++;
                        same = true;
                        break;
                    }
                }
                if(!same){
                    var obj = {id:id, num: 1};
                    cookieArr.push(obj);
                }

                //存储回去
                $.cookie("goods", JSON.stringify(cookieArr), {
                    expires: 7
                })
            }

            sc_num();
            rightCart();
            ballMove(this);
        })
    }

    function rightCart(){
        //每一次在加载本次数据之前，都要清除上一次的数据
        $(".sc_right ul").empty();
        
        //找到购物车中商品信息
        $.ajax({
            type: "get",
            url: "../data/data.json",
            success: function(arr){
                var cookieStr = $.cookie("goods");
                if(cookieStr){
                    var newArr = [];
                    var cookieArr = JSON.parse(cookieStr);
                    for(var i = 0; i < arr.length; i++){
                        for(var j = 0; j < cookieArr.length; j++){
                            if(arr[i].id == cookieArr[j].id){
                                arr[i].num = cookieArr[j].num;
                                newArr.push(arr[i]);
                            }
                        }
                    }
                    // console.log(newArr);
                }

                //创建节点添加到页面上
                for(var i = 0; i < newArr.length; i++){
                    var node = $(`<li id="${newArr[i].id}">
                    <div class="sc_goodsPic">
                        <img src="${newArr[i].img}" alt="">
                    </div>
                    <div class="sc_goodsTitle">
                        <p>这是商品曲奇饼干</p>
                    </div>
                    <div class="sc_goodsBtn">购买</div>
                    <div class="delete_goodsBtn">删除</div>
                    <div class="sc_goodsNum">
                    <div>
                        <button>+</button>
                        <button>-</button>
                        <span>商品数量：${newArr[i].num}</span>
                    </div>
                </div></li>`);
                    node.appendTo($(".sc_right ul"));
                }
            },
            error: function(msg){
                console.log(msg);
            }
        })

        
    }

    function rightCartEvent(){
        //添加移入和移出的效果
        $(".sc_right").mouseenter(function(){
            $(this).stop(true).animate({right: 0}, 800)
        });
        $(".sc_right").mouseleave(function(){
            $(this).stop(true).animate({right: -270}, 800)
        });

        //给右侧购物车添加删除功能
        $(".sc_right ul").on("click", ".delete_goodsBtn", function(){
            var id = $(this).closest("li").remove().attr("id");
            //想办法删除cookie的数据
            var cookieArr = JSON.parse($.cookie("goods"));
            for(var i = 0; i < cookieArr.length; i++){
                if(cookieArr[i].id == id){
                    cookieArr.splice(i, 1);
                    break;
                }
            }

            //将数据存回去
            cookieArr.length == 0 ? $.cookie("goods", null) : $.cookie("goods", JSON.stringify(cookieArr));
            sc_num();
        })

        //给右侧购物车添加+和-操作
        $(".sc_right ul").on("click", ".sc_goodsNum button", function(){
            var id = $(this).closest("li").attr("id");
            var cookieArr = JSON.parse($.cookie("goods"));
           
            //找出id相同元素的下表
            var index = cookieArr.findIndex(item => item.id == id);
           
            if(this.innerHTML == "+"){
                cookieArr[index].num++;
            }else{
                cookieArr[index].num == 1 ? alert("该数量为1，不能再减少") : cookieArr[index].num--;
            }

            $.cookie("goods", JSON.stringify(cookieArr));
            $(this).siblings("span").html(`商品数量：${cookieArr[index].num}` );
            sc_num();
        })
    }

    function ballMove(node){
        $("#ball").css({
            left: $(node).offset().left,
            top: $(node).offset().top,
            display: "block"
        })

        var X = $(".sc_right .sc_pic").offset().left - $(node).offset().left;
        var Y = $(".sc_right .sc_pic").offset().top - $(node).offset().top;
        //2、创建一个抛物线对象
        var bool = new Parabola({
             el: "#ball",
             offset: [X, Y],
             duration: 500,
             curvature: 0.001,
             callback: function(){
                 $("#ball").hide();
             }
        })

        bool.start();
    }

    //计算购物车数量总数
    function sc_num(){
        var cookieStr = $.cookie("goods");
        if(cookieStr){
            //计算购物车的数量
            var cookieArr = JSON.parse(cookieStr);
            var sum = 0;
            cookieArr.forEach(item => {sum += item.num});
            
            $(".sc_right .sc_num").html(sum);
        }else{
            $(".sc_right .sc_num").html(0);
        }
    }

    function clearBtn(){
        $("#clearBtn").click(function(){
            $.cookie("goods", null);
            sc_num();
            $(".sc_right ul").empty();
        })
    }
    return {
        download: download,
        addToCart: addToCart,
        rightCart: rightCart,
        rightCartEvent: rightCartEvent,
        clearBtn: clearBtn
    }
})