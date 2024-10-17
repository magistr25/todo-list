import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetEditing, setFilter, reorderTasks } from '../features/todo/todoSlice';
import Task from './Task';
import styles from './TaskList.module.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const TaskList = () => {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.todo.tasks);
    const filter = useSelector((state) => state.todo.filter);

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true;
    });

    // Функция для изменения порядка задач
    const moveTask = useCallback(
        (dragIndex, hoverIndex) => {
            const updatedTasks = [...filteredTasks];
            const [removed] = updatedTasks.splice(dragIndex, 1);
            updatedTasks.splice(hoverIndex, 0, removed);
            dispatch(reorderTasks(updatedTasks));
        },
        [filteredTasks, dispatch]
    );

    const handleFilterChange = (newFilter) => {
        dispatch(resetEditing());
        dispatch(setFilter(newFilter));
    };

    return (
        <DndProvider backend={HTML5Backend}>
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
                {filteredTasks.map((task, index) => (
                    <Task key={task.id} task={task} index={index} moveTask={moveTask} />
                ))}
            </div>
        </DndProvider>
    );
};

export default TaskList;
