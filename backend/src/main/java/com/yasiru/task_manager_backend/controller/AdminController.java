package com.yasiru.task_manager_backend.controller;

import com.yasiru.task_manager_backend.dto.TaskResponse;
import com.yasiru.task_manager_backend.enums.TaskPriority;
import com.yasiru.task_manager_backend.enums.TaskStatus;
import com.yasiru.task_manager_backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/tasks")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    private final TaskService taskService;
    
    @GetMapping
    public ResponseEntity<Page<TaskResponse>> getAllTasks(
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskPriority priority,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("ASC") 
            ? Sort.by(sortBy).ascending() 
            : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<TaskResponse> response;
        
        if (status != null && priority != null) {
            response = taskService.getAllTasksByStatusAndPriority(status, priority, pageable);
        } else if (status != null) {
            response = taskService.getAllTasksByStatus(status, pageable);
        } else if (priority != null) {
            response = taskService.getAllTasksByPriority(priority, pageable);
        } else {
            response = taskService.getAllTasks(pageable);
        }
        
        return ResponseEntity.ok(response);
    }
}
