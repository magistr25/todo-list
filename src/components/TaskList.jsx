import { useState } from 'react';
import { useSelector } from 'react-redux';
import Task from './Task';
import styles from './TaskList.module.css';

const TaskList = () => {
    const [filter, setFilter] = useState('all');
    const tasks = useSelector((state) => state.todo.tasks);

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true;
    });

    return (
        <div>
            <div className={styles.btnContainer} >
                <button className={styles.btn} onClick={() => setFilter('all')}>Все</button>
                <button className={styles.btn1} onClick={() => setFilter('completed')}>Выполнено</button>
                <button className={styles.btn2} onClick={() => setFilter('incomplete')}>Не выполнено</button>
            </div>
            {filteredTasks.map((task) => (
                <Task key={task.id} task={task} />
            ))}
        </div>
    );
};

export default TaskList;

