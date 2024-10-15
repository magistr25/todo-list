import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from './features/todo/todoSlice';
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import styles from './App.module.css';

export const App = () => {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.todo.tasks);

    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (savedTasks) {
            savedTasks.forEach((task) => dispatch(addTask(task)));
        }
    }, [dispatch]);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <h1>Список дел</h1>
                <TaskForm />
                <TaskList />
            </div>
        </div>
    );
};

