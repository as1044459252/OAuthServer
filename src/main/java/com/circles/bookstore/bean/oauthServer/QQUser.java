package com.circles.bookstore.bean.oauthServer;

public class QQUser {
    private String qqNumber;
    private String password;
    private String code;
    private boolean isUsed;
    private String accessToken;

    public QQUser() {
    }

    public QQUser(String qqNumber, String password, String code, boolean isUsed, String accessToken) {
        this.qqNumber = qqNumber;
        this.password = password;
        this.code = code;
        this.isUsed = isUsed;
        this.accessToken = accessToken;
    }

    public String getQqNumber() {
        return qqNumber;
    }

    public void setQqNumber(String qqNumber) {
        this.qqNumber = qqNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public boolean isUsed() {
        return isUsed;
    }

    public void setUsed(boolean used) {
        isUsed = used;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    @Override
    public String toString() {
        return "QQUser{" +
                "qqNumber='" + qqNumber + '\'' +
                ", password='" + password + '\'' +
                ", code='" + code + '\'' +
                ", isUsed=" + isUsed +
                ", accessToken='" + accessToken + '\'' +
                '}';
    }
}
