/**
 * Toast Notification System - Usage Examples
 * 
 * Import the useToast hook in any component:
 * import { useToast } from '@/context/ToastContext';
 */

// Example 1: Success Toast
import { useToast } from '@/context/ToastContext';

function CreateQuizComponent() {
  const { addToast } = useToast();

  const handleCreateQuiz = async () => {
    try {
      // ... create quiz logic
      addToast('Quiz created successfully!', 'success');
    } catch (error) {
      addToast('Failed to create quiz', 'error');
    }
  };

  return <button onClick={handleCreateQuiz}>Create Quiz</button>;
}

// Example 2: Error Toast
function LoginComponent() {
  const { addToast } = useToast();

  const handleLogin = async () => {
    try {
      // ... login logic
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      addToast(errorMessage, 'error');
    }
  };

  return <button onClick={handleLogin}>Login</button>;
}

// Example 3: Warning Toast
function FormComponent() {
  const { addToast } = useToast();

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      addToast('Please fill in all fields', 'warning');
      return;
    }
    // ... submit logic
  };

  return <button onClick={handleSubmit}>Submit</button>;
}

// Example 4: Info Toast with Custom Duration
function ConnectionComponent() {
  const { addToast } = useToast();

  const checkConnection = () => {
    if (!isConnected) {
      addToast('Not connected to server', 'warning', 2000); // 2 seconds
    } else {
      addToast('Connected successfully', 'info', 3000); // 3 seconds
    }
  };

  return <button onClick={checkConnection}>Check Connection</button>;
}

// Example 5: Multiple Toast Types
function DashboardComponent() {
  const { addToast } = useToast();

  const handleActions = {
    save: () => addToast('Changes saved successfully', 'success'),
    delete: () => addToast('Item deleted', 'info'),
    error: () => addToast('An error occurred', 'error'),
    warn: () => addToast('This action cannot be undone', 'warning', 4000),
  };

  return (
    <div>
      <button onClick={handleActions.save}>Save</button>
      <button onClick={handleActions.delete}>Delete</button>
      <button onClick={handleActions.error}>Trigger Error</button>
      <button onClick={handleActions.warn}>Show Warning</button>
    </div>
  );
}

/**
 * API Reference:
 * 
 * addToast(message: string, type?: ToastType, duration?: number)
 * - message: The text to display in the toast
 * - type: 'success' | 'error' | 'warning' | 'info' (default: 'info')
 * - duration: Time in milliseconds before auto-dismiss (default: 5000)
 * 
 * removeToast(id: string)
 * - Manually remove a toast by its ID
 * 
 * Toast Types and Colors:
 * - success: Emerald green (bg-emerald-500/20, border-emerald-500/50, text-emerald-300)
 * - error: Red (bg-red-500/20, border-red-500/50, text-red-300)
 * - warning: Amber (bg-amber-500/20, border-amber-500/50, text-amber-300)
 * - info: Cyan (bg-cyan-500/20, border-cyan-500/50, text-cyan-300)
 */
