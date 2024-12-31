import { useState, useEffect } from 'react';
import './App.css';

export function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const fetchTodos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/todos/');
      if (!response.ok) throw new Error('Failed to fetch todos');
      const data = await response.json();
      setTodos(data);
      setError('');
    } catch (err) {
      setError('Failed to load todos');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      setError('Todo description is required');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/todos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: newTodo.trim() }),
      });

      if (!response.ok) throw new Error('Failed to create todo');
      
      setNewTodo('');
      setError('');
      await fetchTodos();
    } catch (err) {
      setError('Failed to create todo');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  const toggleTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${id.$oid}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !todos.find(t => t._id.$oid === id.$oid).completed }),
      });
      if (!response.ok) throw new Error('Failed to update todo');
      await fetchTodos();
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/todos/${id.$oid}/`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete todo');
      await fetchTodos();
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="App">
      <div className="container">
        <h1 className="title">List of TODOs</h1>
        
        <div className="filter-buttons">
          <button 
            onClick={() => setFilter('all')}
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('active')}
            className={`filter-button ${filter === 'active' ? 'active' : ''}`}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
          >
            Completed
          </button>
        </div>

        {error && <p className="error">{error}</p>}
        {isLoading ? (
          <p>Loading...</p>
        ) : filteredTodos.length === 0 ? (
          <p>No todos found</p>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map((todo) => (
              <li key={todo._id} className="todo-item">
                <div className="todo-content">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo._id)}
                  />
                  <span className={todo.completed ? 'completed' : ''}>
                    {todo.description}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="container">
        <h2 className="title">Create a ToDo</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="input-group">
            <label htmlFor="todo">ToDo:</label>
            <input
              type="text"
              id="todo"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className="input"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="submit-button"
          >
            {isLoading ? 'Adding...' : 'Add ToDo!'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;