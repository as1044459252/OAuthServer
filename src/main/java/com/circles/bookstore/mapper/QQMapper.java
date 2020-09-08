package com.circles.bookstore.mapper;

import com.circles.bookstore.bean.oauthServer.QQUser;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface QQMapper {
    QQUser checkQQ(@Param("qqNumber")String qqNumber,@Param("password")String password);
    void updateCode(@Param("qqNumber")String qqNumber,@Param("code")String code);
    void setUsed(@Param("qqNumber")String qqNumber);
    void setNotUsed(@Param("qqNumber")String qqNumber);
    void updateToken(@Param("qqNumber")String qqNumber,@Param("accessToken")String accessToken);
    QQUser getQQUserByCode(@Param("code")String code);
    public QQUser getQQUserByToken(String token);

}
