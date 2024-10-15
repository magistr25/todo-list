import { useDispatch, useSelector } from 'react-redux';
import {resetEditing, setFilter} from '../features/todo/todoSlice';
import Task from './Task';
import styles from './TaskList.module.css';

const TaskList = () => {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.todo.tasks);
    const filter = useSelector((state) => state.todo.filter);

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true;
    });

    const handleFilterChange = (newFilter) => {
        dispatch(resetEditing());
         dispatch(setFilter(newFilter));
    };

    return (
        <div>
            <div className={styles.btnContainer}>
                <button
                    className={`${styles.btn} ${filter === 'all' ? styles.activeBtn : ''}`}
                    onClick={() => handleFilterChange('all')}
                >
                    Все
                </button>
                <button
                    className={`${styles.btn1} ${filter === 'completed' ? styles.activeBtn1 : ''}`}
                    onClick={() => handleFilterChange('completed')}
                >
                    Выполнено
                </button>
                <button
                    className={`${styles.btn2} ${filter === 'incomplete' ? styles.activeBtn2 : ''}`}
                    onClick={() => handleFilterChange('incomplete')}
                >
                    Не выполнено
                </button>
            </div>
            {filteredTasks.map((task) => (
                <Task key={task.id} task={task} />
            ))}
        </div>
    );
};


export default TaskList;
