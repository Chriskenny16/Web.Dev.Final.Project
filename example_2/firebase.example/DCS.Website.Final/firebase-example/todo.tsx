import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/firebase";
import { collection, addDoc, query, onSnapshot, doc, deleteDoc, updateDoc, Timestamp, orderBy } from "firebase/firestore";
import { User } from "firebase/auth";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Timestamp;
  userId: string;
};

type TodoProps = {
  user: User;
};

export function Todo({ user }: TodoProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "todos"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const todoList: Todo[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Todo, "id">;
        // Only show todos belonging to the current user
        if (data.userId === user.uid) {
          todoList.push({
            id: doc.id,
            ...data,
          });
        }
      });
      setTodos(todoList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim() || !user) return;

    try {
      await addDoc(collection(db, "todos"), {
        text: newTodo,
        completed: false,
        createdAt: Timestamp.now(),
        userId: user.uid,
      });
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const todoRef = doc(db, "todos", id);
      await updateDoc(todoRef, {
        completed: !completed,
      });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(db, "todos", id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  if (loading) {
    return <div>Loading todos...</div>;
  }

  return (
    <div style={{ width: "100%", maxWidth: "500px" }}>
      <h2 style={{ marginBottom: "20px", color: "white" }}>My Todo List</h2>
      
      <form onSubmit={addTodo} style={{ display: "flex", marginBottom: "20px" }}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo"
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "4px 0 0 4px",
            border: "1px solid #333",
            background: "#222",
            color: "white",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 15px",
            background: "#3B82F6",
            color: "white",
            border: "none",
            borderRadius: "0 4px 4px 0",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {todos.length === 0 ? (
          <li style={{ textAlign: "center", color: "#666" }}>No todos yet. Add one above!</li>
        ) : (
          todos.map((todo) => (
            <li
              key={todo.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                marginBottom: "8px",
                background: "#1A1A1A",
                borderRadius: "4px",
                border: "1px solid #333",
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id, todo.completed)}
                style={{ marginRight: "10px" }}
              />
              <span
                style={{
                  flex: 1,
                  textDecoration: todo.completed ? "line-through" : "none",
                  color: todo.completed ? "#666" : "white",
                }}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#EF4444",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
} 