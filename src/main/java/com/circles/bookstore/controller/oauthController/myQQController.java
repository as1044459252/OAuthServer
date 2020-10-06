package com.circles.bookstore.controller.oauthController;

import com.circles.bookstore.bean.oauthServer.QQUser;
import com.circles.bookstore.service.oauthService.QQLoginService;
import org.apache.oltu.oauth2.as.issuer.MD5Generator;
import org.apache.oltu.oauth2.as.issuer.OAuthIssuer;
import org.apache.oltu.oauth2.as.issuer.OAuthIssuerImpl;
import org.apache.oltu.oauth2.as.request.OAuthAuthzRequest;
import org.apache.oltu.oauth2.as.request.OAuthTokenRequest;
import org.apache.oltu.oauth2.as.response.OAuthASResponse;
import org.apache.oltu.oauth2.common.OAuth;
import org.apache.oltu.oauth2.common.exception.OAuthProblemException;
import org.apache.oltu.oauth2.common.exception.OAuthSystemException;
import org.apache.oltu.oauth2.common.message.OAuthResponse;
import org.apache.oltu.oauth2.common.message.types.ParameterStyle;
import org.apache.oltu.oauth2.common.message.types.ResponseType;
import org.apache.oltu.oauth2.rs.request.OAuthAccessResourceRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.net.InetAddress;
import java.net.URI;
import java.net.URISyntaxException;
/*
这个controller属于IDP，即QQ。
 */
@Controller
public class myQQController {
    @Autowired
    QQLoginService qqLoginService;

    //跳转到登录页面的请求处理
    @RequestMapping("/myQQ")
    public String toMyQQ(HttpServletRequest request, HttpSession session){
        try {
            OAuthAuthzRequest oauthRequest = new OAuthAuthzRequest(request);
            //检验请求正确性
            if(qqLoginService.checkReq(oauthRequest)) { //这里使用假检验，默认为true，需要再添加真检验
                //这里使用session，如果使用ajax的话，就可以不用繁琐地使用session，后面有必要再改进
                session.setAttribute("resType",oauthRequest.getResponseType());
                session.setAttribute("redirectUri",oauthRequest.getRedirectURI());
                session.setAttribute("state",oauthRequest.getState());
                session.setAttribute("request",request);
                return "QQLogin";
            }
            else
                return "error";
        }
        catch (OAuthProblemException | OAuthSystemException e){
            e.printStackTrace();
        }
        return "error";
    }

    //用户输入账号密码后点击提交的请求处理
    @RequestMapping("/qqLogin")
    @ResponseBody
    public Object QQLogin(HttpSession session,
                          @RequestParam("username") String username,
                          @RequestParam("password") String password,
                          Model model){
        //先验证是否登录成功
        System.out.println("正在登录");
        //查看本机IP，为了本机上测试使用
        InetAddress ia = null;
        try {
            ia = InetAddress.getLocalHost();
            System.out.println(ia.getHostAddress());
        } catch (Exception e) {
            e.printStackTrace();
        }
        boolean isLogin = qqLoginService.login(username,password);
        //验证type，生成code,并添加到对应账号
        if(isLogin) {
            String authCode = "";
            String resType = (String) session.getAttribute("resType");
            String redirectUri = (String) session.getAttribute("redirectUri");
            String state = (String) session.getAttribute("state");
            HttpServletRequest request = (HttpServletRequest) session.getAttribute("request");
            if (resType.equals(ResponseType.CODE.toString())) {
                OAuthIssuerImpl oAuthIssuer = new OAuthIssuerImpl(new MD5Generator());
                try {
                    authCode = oAuthIssuer.authorizationCode();
                    qqLoginService.addCode(authCode, username);
                    OAuthASResponse.OAuthAuthorizationResponseBuilder builder = OAuthASResponse.authorizationResponse(request, HttpServletResponse.SC_FOUND);
                    builder.setCode(authCode);
                    builder.setParam("state",state);
                    OAuthResponse response = builder.location(redirectUri).buildQueryMessage();
                    HttpHeaders headers = new HttpHeaders();
                    headers.setLocation(new URI(response.getLocationUri()));
                    return new ResponseEntity(headers, HttpStatus.valueOf(response.getResponseStatus()));
                } catch (OAuthSystemException | URISyntaxException e) {
                    e.printStackTrace();
                }
            }
            return "error";
        }
        else {
            //若登录失败直接跳转到错误页面，若有必要可以实现跳转机制，比较麻烦，需要ajax
            return "error";
        }
    }

    //接收code并发布accessToken
    @RequestMapping("/getToken")
    public Object getToken(HttpServletRequest request){
        try {
            OAuthTokenRequest oAuthTokenRequest = new OAuthTokenRequest(request);
            String code = oAuthTokenRequest.getCode();
            QQUser qqUser = qqLoginService.getQQUserByCode(code);
            boolean isCorrect = qqLoginService.checkCodeRequest(oAuthTokenRequest);
            String accessToken = "";
            if(isCorrect){
                //首先将code设置为已经使用
                qqLoginService.setUsed(qqUser.getQqNumber());
                String oldToken = qqUser.getAccessToken();
                //判断token是否存在和token是否过期，这里先没有考虑过期时间
                if(oldToken==null||oldToken=="") {
                    OAuthIssuer issuer = new OAuthIssuerImpl(new MD5Generator());
                    accessToken = issuer.accessToken();
                    qqLoginService.addToken(qqUser.getQqNumber(), accessToken);
                }
                else{
                    accessToken = oldToken;
                }
                OAuthResponse response = OAuthASResponse.tokenResponse(HttpServletResponse.SC_OK)
                        .setAccessToken(accessToken).buildJSONMessage();
                return new ResponseEntity(response.getBody(),HttpStatus.valueOf(response.getResponseStatus()));
            }
        } catch (OAuthSystemException e) {
            e.printStackTrace();
        } catch (OAuthProblemException e) {
            e.printStackTrace();
        }
        return "error";
    }

    @RequestMapping("/getUserInfo")
    public Object getUserInfo(HttpServletRequest request){
        try {
            OAuthAccessResourceRequest resourceRequest = new OAuthAccessResourceRequest(request, ParameterStyle.QUERY);
            String accessToken = resourceRequest.getAccessToken();
            QQUser user = qqLoginService.getQQUserByToken(accessToken);
            if(user!=null){
                String qqNumber = user.getQqNumber();
                return new ResponseEntity(qqNumber,HttpStatus.OK);
            }
            else {
                return "error";
            }
        } catch (OAuthSystemException e) {
            e.printStackTrace();
        } catch (OAuthProblemException e) {
            e.printStackTrace();
        }
        return "error";
    }



}

