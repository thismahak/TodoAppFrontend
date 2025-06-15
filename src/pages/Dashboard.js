import React, { useEffect, useState , useCallback} from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [desc, setDesc] = useState('');
  const [filter, setFilter] = useState('all');

  const token = localStorage.getItem('token');

  
  // ✅ useCallback so it doesn't recreate on each render
  const fetchTodos = useCallback(async () => {
    try {
      const res = await API.get('/todos', {
        headers: { Authorization: token },
      });
      setTodos(res.data);
    } catch (err) {
      console.error(err);
      navigate('/');
    }
  }, [token, navigate]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);


  const addTodo = async () => {
    if (!text) return;
    try {
      await API.post(
        '/todos',
        { text: text, description: desc },
        { headers: { Authorization: token } }
      );
      alert('Todo added successfully!');
      setText('');
      setDesc('');
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      await API.put(
        `/todos/${id}`,
        { completed: !todo.completed },
        { headers: { Authorization: token } }
      );
      alert(`Todo marked as ${!todo.completed ? 'completed' : 'incomplete'}!`);
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await API.delete(`/todos/${id}`, {
        headers: { Authorization: token },
      });
      alert('Todo deleted successfully!');
      fetchTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'incomplete') return !todo.completed;
    return true;
  });

  return (
    <div className="container">

    
    <div className="dashboard">
      <h2>My Todos</h2>
      <div className="add-todo">
        <input
          type="text"
          placeholder="Title"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <div className="filters">
        <button 
        className={filter === 'all' ? 'active' : ''}
        onClick={() => setFilter('all')}>All</button>
        <button 
        className={filter === 'completed' ? 'active' : ''}
        onClick={() => setFilter('completed')}>Completed</button>
        <button 
        className={filter === 'incomplete' ? 'active' : ''}
        onClick={() => setFilter('incomplete')}>Incomplete</button>
      </div>

      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <li key={todo._id}>
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
            >
              <strong>{todo.text}</strong> - {todo.description}
            </span>
            <div>
              <button onClick={() => toggleTodo(todo._id)}>
                {todo.completed ? 'Undo' : 'Done'}
              </button>
              <button onClick={() => deleteTodo(todo._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}

export default Dashboard;
