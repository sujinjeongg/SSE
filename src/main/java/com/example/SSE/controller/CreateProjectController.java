package com.example.SSE.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CreateProjectController {
    @GetMapping("/api/create_project")
    public String test() {
        return "Create project";
    }
}
