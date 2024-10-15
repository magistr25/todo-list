import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../features/todo/todoSlice';
import styles from './TaskForm.module.css';

const TaskForm = () => {
    const [title, setTitle] = useState('');
    const dispatch = useDispatch();
    const [isPressed, setIsPressed] = useState(false);

    const handleMouseDown = () => {
        setIsPressed(true);
    };

    const handleMouseUp = () => {
        setIsPressed(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (title) {
            dispatch(addTask({ id: Date.now(), title, completed: false }));
            setTitle('');
        }
    };

    return (
        <form className={styles.taskForm} onSubmit={handleSubmit}>
            <input
                className={styles.taskInput}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Создать задачу"
            />
            <button
                type="submit"
                className={styles.taskButton}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <img
                    src="src/assets/plus.png"
                    alt="Добавить задачу"
                    className={styles.taskImage}
                    style={{
                        transform: isPressed ? 'scale(0.9)' : 'scale(1)',
                        transition: 'transform 0.2s ease',
                    }}
                />
            </button>
        </form>
    );
};

export default TaskForm;
