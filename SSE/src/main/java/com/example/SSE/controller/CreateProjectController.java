package com.example.SSE.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CreateProjectController {
    @GetMapping("/create_project")
    public String createProject() {
        return "create_project";
    }
}
