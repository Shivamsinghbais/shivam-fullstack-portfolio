package com.shivam.backend.job;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobRepository repo;

    @Autowired
    public JobController(JobRepository repo) {
        this.repo = repo;
    }

    // GET /api/jobs?page=0&size=10&q=keyword
    @GetMapping
    public Page<Job> list(@RequestParam(value = "q", required = false) String q, Pageable pageable) {
        if (q != null && !q.isBlank()) {
            return repo.findByTitleContainingIgnoreCase(q, pageable);
        }
        return repo.findAll(pageable);
    }
}

