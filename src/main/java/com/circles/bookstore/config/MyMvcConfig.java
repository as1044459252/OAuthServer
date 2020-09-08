package com.circles.bookstore.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


/*
    mvc的视图控制器，可以在其中添加拦截器
    优化代码：取消在controller中编写多个控制跳转的页面，转为在此类中统一管理
    项目中存在bug：因为点击登录按钮后执行/toLogin，因此无法显示对应页面的具体名称
 */
@Configuration
public class MyMvcConfig implements WebMvcConfigurer {
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
    }




    //添加拦截器，使得没登录的用户无法访问个人信息页面
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
    }
}
