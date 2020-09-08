package com.circles.bookstore;


import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.sql.SQLException;
import java.util.Date;

@SpringBootTest
class DemoApplicationTests {
    @Autowired
    DataSource dataSource;





    @Test
    void contextLoads() {
        Date date = new Date();
        System.out.println(date);
    }

}
