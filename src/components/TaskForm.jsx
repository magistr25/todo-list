import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../features/todo/todoSlice';
import styles from'./TaskForm.module.css';

const TaskForm = () => {
    const [title, setTitle] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title) {
            dispatch(addTask({ id: Date.now(), title, completed: false }));
            setTitle('');
        }
    };

    return (
        <form className= {styles.taskForm} onSubmit={handleSubmit}>
            <input className= {styles.taskInput}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Создать задачу"
            />
            <button type="submit" className="taskButton">
                <svg width="60" height="50" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="59" height="49" rx="9.5" stroke="#30324B"/>
                    <rect x="29" y="10" width="2" height="30" fill="#30324B"/>
                    <rect x="45" y="24" width="2" height="30" transform="rotate(90 45 24)" fill="#30324B"/>
                </svg>
            </button>

        </form>
    );
};

export default TaskForm;
