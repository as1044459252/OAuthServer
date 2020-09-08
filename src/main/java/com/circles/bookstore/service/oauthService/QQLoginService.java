package com.circles.bookstore.service.oauthService;

import com.circles.bookstore.bean.oauthServer.QQUser;
import com.circles.bookstore.mapper.QQMapper;
import org.apache.oltu.oauth2.as.request.OAuthAuthzRequest;
import org.apache.oltu.oauth2.as.request.OAuthTokenRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

//qq处理请求的Service
@Service
public class QQLoginService {
    @Autowired
    QQMapper qqMapper;
    public void addCode(String code, String qqNumber){
        qqMapper.updateCode(qqNumber,code);
        qqMapper.setNotUsed(qqNumber);
    }

    public void setUsed(String qqNumber){
        qqMapper.setUsed(qqNumber);
    }

    public void addToken(String qqNumber, String token){
        qqMapper.updateToken(qqNumber, token);
    }

    public QQUser getQQUserByCode(String code){
        return qqMapper.getQQUserByCode(code);
    }

    public boolean checkReq(OAuthAuthzRequest oauthRequest){
        return true;
    }

    public boolean checkCode(OAuthAuthzRequest oauthRequest){
        return true;
    }

    public boolean checkCodeRequest(OAuthTokenRequest oAuthTokenRequest){return true;}

    public boolean login(String username,String password){
        QQUser qqUser = qqMapper.checkQQ(username,password);
        if(qqUser!=null)
            return true;
        else
            return false;
    }

    public QQUser getQQUserByToken(String token){return qqMapper.getQQUserByToken(token);}
}
