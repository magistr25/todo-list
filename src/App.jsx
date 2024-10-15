import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import styles from './App.module.css';

export const App = () => {

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

