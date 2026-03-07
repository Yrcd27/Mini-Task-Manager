package com.yasiru.task_manager_backend.service;

import com.yasiru.task_manager_backend.dto.TaskRequest;
import com.yasiru.task_manager_backend.dto.TaskResponse;
import com.yasiru.task_manager_backend.entity.Task;
import com.yasiru.task_manager_backend.entity.User;
import com.yasiru.task_manager_backend.enums.TaskPriority;
import com.yasiru.task_manager_backend.enums.TaskStatus;
import com.yasiru.task_manager_backend.repository.TaskRepository;
import com.yasiru.task_manager_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskService {
    
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    
    // Get current authenticated user
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
    
    // Convert Task entity to TaskResponse DTO
    private TaskResponse toTaskResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setPriority(task.getPriority());
        response.setDueDate(task.getDueDate());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());
        response.setUserId(task.getUser().getId());
        response.setUserName(task.getUser().getName());
        return response;
    }
    
    // Create new task
    public TaskResponse createTask(TaskRequest request) {
        User user = getCurrentUser();
        
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        task.setUser(user);
        
        Task savedTask = taskRepository.save(task);
        return toTaskResponse(savedTask);
    }
    
    // Get all tasks for current user
    public Page<TaskResponse> getMyTasks(Pageable pageable) {
        User user = getCurrentUser();
        Page<Task> tasks = taskRepository.findByUser(user, pageable);
        return tasks.map(this::toTaskResponse);
    }
    
    // Get tasks by status
    public Page<TaskResponse> getMyTasksByStatus(TaskStatus status, Pageable pageable) {
        User user = getCurrentUser();
        Page<Task> tasks = taskRepository.findByUserAndStatus(user, status, pageable);
        return tasks.map(this::toTaskResponse);
    }
    
    // Get tasks by priority
    public Page<TaskResponse> getMyTasksByPriority(TaskPriority priority, Pageable pageable) {
        User user = getCurrentUser();
        Page<Task> tasks = taskRepository.findByUserAndPriority(user, priority, pageable);
        return tasks.map(this::toTaskResponse);
    }
    
    // Get tasks by status and priority
    public Page<TaskResponse> getMyTasksByStatusAndPriority(TaskStatus status, TaskPriority priority, Pageable pageable) {
        User user = getCurrentUser();
        Page<Task> tasks = taskRepository.findByUserAndStatusAndPriority(user, status, priority, pageable);
        return tasks.map(this::toTaskResponse);
    }
    
    // Get single task by ID
    public TaskResponse getTaskById(Long id) {
        User user = getCurrentUser();
        
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        
        // Check ownership
        if (!task.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You don't have permission to access this task");
        }
        
        return toTaskResponse(task);
    }
    
    // Update task
    public TaskResponse updateTask(Long id, TaskRequest request) {
        User user = getCurrentUser();
        
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        
        // Check ownership
        if (!task.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You don't have permission to update this task");
        }
        
        // Update fields
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDueDate(request.getDueDate());
        
        Task updatedTask = taskRepository.save(task);
        return toTaskResponse(updatedTask);
    }
    
    // Delete task
    public void deleteTask(Long id) {
        User user = getCurrentUser();
        
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        
        // Check ownership
        if (!task.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You don't have permission to delete this task");
        }
        
        taskRepository.delete(task);
    }
    
    // ============ ADMIN ONLY METHODS ============
    
    // Get all tasks (admin only)
    public Page<TaskResponse> getAllTasks(Pageable pageable) {
        Page<Task> tasks = taskRepository.findAll(pageable);
        return tasks.map(this::toTaskResponse);
    }
    
    // Get tasks by status (admin only)
    public Page<TaskResponse> getAllTasksByStatus(TaskStatus status, Pageable pageable) {
        Page<Task> tasks = taskRepository.findByStatus(status, pageable);
        return tasks.map(this::toTaskResponse);
    }
    
    // Get tasks by priority (admin only)
    public Page<TaskResponse> getAllTasksByPriority(TaskPriority priority, Pageable pageable) {
        Page<Task> tasks = taskRepository.findByPriority(priority, pageable);
        return tasks.map(this::toTaskResponse);
    }
    
    // Get tasks by status and priority (admin only)
    public Page<TaskResponse> getAllTasksByStatusAndPriority(TaskStatus status, TaskPriority priority, Pageable pageable) {
        Page<Task> tasks = taskRepository.findByStatusAndPriority(status, priority, pageable);
        return tasks.map(this::toTaskResponse);
    }
}
