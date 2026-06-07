import { useState } from 'react';

export default function EventToDo() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        const taskvalue = task.trim();
        if(taskvalue === ""){
            alert("Please enter a task");
            return;
        }
        setTasks((prev) => [...prev, taskvalue]);
        setTask('');
    }

    function handleDelete(indexToRemove) {
        setTasks((prev) => prev.filter((_, index) => index !== indexToRemove));
    }

    return(
        <>
        <h1>To Do List</h1>
        <form onSubmit={handleSubmit}>

            <input
                type="text"
                name="task"
                placeholder="Enter Task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
            />
            <br />
            <ul id="taskList">
                {tasks.map((item, index) => (
                    <li key={`${item}-${index}`}>
                        <span>{item}</span>
                        <button
                            type="button"
                            className="deleteBtn"
                            onClick={() => handleDelete(index)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            <br />
            <button type="submit">Add Task</button>
        </form>
        </>
    );
}