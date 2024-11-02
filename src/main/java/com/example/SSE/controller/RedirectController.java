package com.example.SSE.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RedirectController {

    /** 백엔드 주소 대신 프론트엔드 주소로 이동합니다.
     * @return 프론트엔드 주소. */
    @GetMapping("/")
    public String redirect() {
        return "redirect:http://localhost:3000";
    }
}
