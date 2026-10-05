import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("routineTasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [taskName, setTaskName] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [category, setCategory] = useState("Daily Routine");
  const [snoozedCount, setSnoozedCount] = useState(() => {
    return Number(localStorage.getItem("snoozedCount")) || 0;
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    localStorage.setItem("routineTasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("snoozedCount", snoozedCount);
  }, [snoozedCount]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const addTask = () => {
    if (!taskName.trim() || !reminderTime) {
      alert("Please enter task name and reminder time.");
      return;
    }

    const newTask = {
      id: Date.now(),
      name: taskName,
      time: reminderTime,
      category,
      completed: false,
      snoozed: 0,
    };

    setTasks([...tasks, newTask]);
    setTaskName("");
    setReminderTime("");
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const snoozeTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, snoozed: task.snoozed + 1 }
          : task
      )
    );

    setSnoozedCount((count) => count + 1);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const clearCompleted = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const resetAll = () => {
    if (window.confirm("Reset all tasks?")) {
      setTasks([]);
      setSnoozedCount(0);
    }
  };

  const setQuickTime = (minutes) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);

    const hours = String(date.getHours()).padStart(2, "0");
    const mins = String(date.getMinutes()).padStart(2, "0");

    setReminderTime(`${hours}:${mins}`);
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const formattedTime = currentTime.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <div className="app">
      <div className="container">

        <header className="header">
          <div>
            <h1>RoutinePulse</h1>
            <p>Daily Routine Task Reminder & Snooze System</p>
          </div>

          <div className="clock">
            <strong>{formattedTime}</strong>
            <span>{formattedDate}</span>
          </div>
        </header>

        <div className="chime">
          <span>🔔</span>
          <strong>Chime</strong>
          <label className="switch">
            <input type="checkbox" defaultChecked />
            <span className="slider"></span>
          </label>
          <span>On</span>
        </div>

        <section className="stats">
          <div className="stat-card">
            <span>Total Tasks</span>
            <strong>{totalTasks}</strong>
          </div>

          <div className="stat-card">
            <span>Pending</span>
            <strong>{pendingTasks}</strong>
          </div>

          <div className="stat-card">
            <span>Completed</span>
            <strong>{completedTasks}</strong>
          </div>

          <div className="stat-card">
            <span>Times Snoozed</span>
            <strong>{snoozedCount}</strong>
          </div>
        </section>

        <div className="actions">
          <button onClick={clearCompleted} className="secondary-btn">
            Clear Completed ({completedTasks})
          </button>

          <button onClick={resetAll} className="danger-btn">
            Reset All
          </button>
        </div>

        <section className="form-card">
          <h2>+ Add New Daily Routine Task</h2>

          <label>Task Name*</label>
          <input
            type="text"
            placeholder="e.g., Morning Meditation, Drink 500ml Water..."
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />

          <div className="form-row">

            <div>
              <label>Reminder Time (24h / Daily) *</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
            </div>

            <div>
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Daily Routine</option>
                <option>Health</option>
                <option>Study</option>
                <option>Work</option>
                <option>Fitness</option>
                <option>Personal</option>
              </select>
            </div>

          </div>

          <div className="snooze-info">
            ⏰ FIXED 5M SNOOZE SUPPORT
          </div>

          <div className="quick-section">
            <h3>Quick Time</h3>

            <div className="quick-buttons">
              <button onClick={() => setQuickTime(0)}>
                Now ({formattedTime.slice(0, 5)})
              </button>

              <button onClick={() => setQuickTime(1)}>
                +1 Min (Test Alert)
              </button>

              <button onClick={() => setQuickTime(5)}>
                +5 Mins
              </button>

              <button onClick={() => setQuickTime(-30)}>
                -30 Mins
              </button>
            </div>
          </div>

          <div className="routine-section">
            <h3>Common Routines</h3>

            <div className="routine-buttons">
              <button onClick={() => setTaskName("Morning Meditation")}>
                🧘 Morning Meditation
              </button>

              <button onClick={() => setTaskName("Drink Water")}>
                💧 Hydrate & Water
              </button>

              <button onClick={() => setTaskName("Evening Wind Down")}>
                🌙 Evening Wind Down
              </button>

              <button onClick={() => setTaskName("Standup / Review")}>
                📋 Standup / Review
              </button>

              <button onClick={() => setTaskName("Posture & Stretch")}>
                🧍 Posture & Stretch
              </button>

              <button onClick={() => setTaskName("Take Vitamins")}>
                💊 Take Vitamins
              </button>
            </div>
          </div>

          <button className="add-btn" onClick={addTask}>
            + Add Task Reminder
          </button>
        </section>

        <section className="task-section">
          <h2>Today's Routine</h2>

          {tasks.length === 0 ? (
            <div className="empty">
              <div>📝</div>
              <p>No tasks added yet.</p>
              <span>Add your first daily routine reminder above.</span>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task) => (
                <div
                  className={`task-card ${
                    task.completed ? "completed" : ""
                  }`}
                  key={task.id}
                >
                  <div className="task-left">
                    <button
                      className="check-btn"
                      onClick={() => toggleComplete(task.id)}
                    >
                      {task.completed ? "✓" : "○"}
                    </button>

                    <div>
                      <h3>{task.name}</h3>
                      <p>
                        ⏰ {task.time} &nbsp; • &nbsp; {task.category}
                      </p>

                      {task.snoozed > 0 && (
                        <small>
                          Snoozed {task.snoozed} time
                          {task.snoozed > 1 ? "s" : ""}
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="task-actions">
                    {!task.completed && (
                      <button
                        className="snooze-btn"
                        onClick={() => snoozeTask(task.id)}
                      >
                        💤 Snooze 5m
                      </button>
                    )}

                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task.id)}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default App;