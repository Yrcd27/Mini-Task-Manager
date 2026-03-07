package com.yasiru.task_manager_backend.repository;

import com.yasiru.task_manager_backend.entity.Task;
import com.yasiru.task_manager_backend.entity.User;
import com.yasiru.task_manager_backend.enums.TaskPriority;
import com.yasiru.task_manager_backend.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    
    // Find all tasks by user
    Page<Task> findByUser(User user, Pageable pageable);
    
    // Find tasks by user and status
    Page<Task> findByUserAndStatus(User user, TaskStatus status, Pageable pageable);
    
    // Find tasks by user and priority
    Page<Task> findByUserAndPriority(User user, TaskPriority priority, Pageable pageable);
    
    // Find tasks by user, status and priority
    Page<Task> findByUserAndStatusAndPriority(User user, TaskStatus status, TaskPriority priority, Pageable pageable);
    
    // Find all tasks with filters (for ADMIN)
    Page<Task> findByStatus(TaskStatus status, Pageable pageable);
    
    Page<Task> findByPriority(TaskPriority priority, Pageable pageable);
    
    Page<Task> findByStatusAndPriority(TaskStatus status, TaskPriority priority, Pageable pageable);
}
