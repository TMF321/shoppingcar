console.log('加载成功');
//配置要引入的.js模块的路径
require.config({
    paths: {
        "jquery": "jquery-1.11.3",
        "jquery-cookie": "jquery.cookie",
        "parabola": "parabola",  //抛物线方程不支持AMD规范
        "banner": "banner",
        "index": "index"
    },
    shim: {
        //设置依赖关系
        "jquery-cookie": ["jquery"],
        //某一个模块，不遵从AMD
        "parabola": {
            exports: "_"
        }

    }
})


//<1>使用简单 <2>模块间的关系
//引入模块，调用实现对应的功能
require(["banner", "index"], function(banner, index){
    banner.bannerTab();

    
    index.download();
    index.addToCart();
    index.rightCart();
    index.rightCartEvent();
    index.clearBtn();
})