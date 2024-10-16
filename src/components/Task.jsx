import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTaskStatus, deleteTask, selectTask, deselectTask, editTask } from '../features/todo/todoSlice';
import styles from './Task.module.css';
import PropTypes from 'prop-types';

const Task = ({ task }) => {
    const dispatch = useDispatch();
    const selectedTaskId = useSelector(state => state.todo.selectedTaskId);
    const [isEditing, setIsEditing] = useState(false);
    const isSelected = selectedTaskId === task.id;
    const [editedTitle, setEditedTitle] = useState(task.title);
    const textAreaRef = useRef(null);
    const originalTitle = useRef(task.title);

    const formatTaskDate = (createdAt) => {
        const taskDate = new Date(createdAt); // Преобразуем строку обратно в объект Date
        const currentDate = new Date();
        const differenceInTime = currentDate.setHours(0, 0, 0, 0) - taskDate.setHours(0, 0, 0, 0);
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);

        if (differenceInDays === 0) {
            return "Сегодня";
        } else if (differenceInDays === 1) {
            return "Вчера";
        } else {
            return taskDate.toLocaleDateString('ru-RU');
        }
    };

    const handleEditClick = () => {
        if (isSelected) {
            dispatch(deselectTask());
            setIsEditing(false);
            setEditedTitle(originalTitle.current);
        } else {
            dispatch(selectTask(task.id));
            setIsEditing(true);
            originalTitle.current = task.title;
            setEditedTitle(task.title);
            setTimeout(() => {
                if (textAreaRef.current) {
                    textAreaRef.current.focus();
                    const length = textAreaRef.current.value.length;
                    textAreaRef.current.setSelectionRange(length, length);
                }
                updateTextAreaHeight();
            }, 0);

            if (!editedTitle.endsWith(' ')) {
                setEditedTitle(editedTitle + ' ');
            }
        }
    };

    const handleSaveClick = () => {
        if (isSelected) {
            const trimmedTitle = editedTitle.trimEnd();
            dispatch(editTask({ id: task.id, title: trimmedTitle }));
            dispatch(deselectTask());
            setIsEditing(false);

            // После завершения редактирования вызываем функцию, чтобы корректно установить высоту
            setTimeout(() => {
                updateTextAreaHeight(); // Пересчёт высоты после изменения содержимого
            }, 0);
        }
    };

    useEffect(() => {
        if (isSelected && textAreaRef.current) {
            textAreaRef.current.focus();
            const length = textAreaRef.current.value.length;
            textAreaRef.current.setSelectionRange(length, length);
        }
    }, [isSelected, editedTitle]);

    const updateTextAreaHeight = () => {
        if (!textAreaRef.current) return;

        // Сбрасываем высоту на 'auto', чтобы измерить необходимую высоту
        textAreaRef.current.style.height = 'auto';

        // Устанавливаем высоту в соответствии с содержимым (scrollHeight)
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    };

    const handleInputChange = (e) => {
        setEditedTitle(e.target.value);
        updateTextAreaHeight(); // Обновляем высоту каждый раз при изменении текста
    };

    // При загрузке компонента можно также сразу установить правильную высоту
    useEffect(() => {
        updateTextAreaHeight();
    }, [editedTitle]);

    return (
        <div className={styles.taskContainer}>
            {/* Отображение даты создания задачи */}
            <div className={styles.taskDate}>
                {formatTaskDate(task.createdAt)} {/* Используем task.createdAt */}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                <label className={styles.taskCheckboxWrapper}>
                    <input
                        className={styles.taskCheckbox}
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => dispatch(toggleTaskStatus(task.id))}
                        disabled={isEditing} // Чекбокс отключен в режиме редактирования
                    />
                    <span className={styles.taskCheckboxCustom}></span>
                </label>

                {isSelected ? (
                    <div className={styles.textAreaContainer}>
                        <textarea
                            className={styles.editInput}
                            ref={textAreaRef}
                            value={typeof editedTitle === "string" ? editedTitle : ""}
                            onChange={handleInputChange}
                            spellCheck={false}
                            style={{
                                height: 'auto',
                                background: 'transparent',
                                position: 'relative',
                                zIndex: '1',
                                textDecoration: 'underline',
                                textDecorationColor: 'rgba(48, 50, 75, 1)',
                                textUnderlineOffset: '7px',
                                whiteSpace: 'pre-wrap',
                                overflow: 'hidden',
                            }}
                        />
                    </div>
                ) : (
                    <textarea
                        className={styles.editInput}
                        ref={textAreaRef}
                        value={typeof editedTitle === "string" ? editedTitle : ""}
                        spellCheck={false}
                        readOnly={true}
                        style={{
                            height: 'auto',
                            background: 'transparent',
                            position: 'relative',
                            zIndex: '1',
                            textDecorationLine: task.completed ? 'line-through' : 'none',
                            textDecorationColor: 'rgba(48, 50, 75, 1)',
                            textDecorationStyle: 'solid',
                        }}
                    />
                )}
            </div>

            <div className={styles.buttons}>
                {isEditing && selectedTaskId && (
                    <button
                        onClick={handleSaveClick}
                        className={styles.saveButton}
                    >
                        Сохранить
                    </button>
                )}
                <button
                    onClick={handleEditClick}
                    className={`${styles.editButton} ${task.completed ? styles.disabledButton : ""}`}
                    disabled={task.completed}
                    style={{
                        cursor: task.completed ? 'not-allowed' : 'pointer',
                        color: isEditing ? '#0013FF' : '#30324B',
                    }}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke={isEditing ? '#0013FF' : 'currentColor'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path
                            d="M12 3H5C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V12"
                        />
                        <path
                            d="M18.3751 2.62498C18.7729 2.22716 19.3125 2.00366 19.8751 2.00366C20.4377 2.00366 20.9773 2.22716 21.3751 2.62498C21.7729 3.02281 21.9964 3.56237 21.9964 4.12498C21.9964 4.68759 21.7729 5.22716 21.3751 5.62498L12.3621 14.639C12.1246 14.8762 11.8313 15.0499 11.5091 15.144L8.63609 15.984C8.55005 16.0091 8.45883 16.0106 8.372 15.9883C8.28517 15.9661 8.20592 15.9209 8.14254 15.8575C8.07916 15.7942 8.03398 15.7149 8.01174 15.6281C7.98949 15.5412 7.991 15.45 8.01609 15.364L8.85609 12.491C8.95062 12.169 9.12463 11.876 9.36209 11.639L18.3751 2.62498Z"
                        />
                    </svg>
                </button>

                <button
                    onClick={() => dispatch(deleteTask(task.id))}
                    className={`${styles.deleteButton}`}
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M7 4C7 3.46957 7.21071 2.96086 7.58579 2.58579C7.96086 2.21071 8.46957 2 9 2H15C15.5304 2 16.0391 2.21071 16.4142 2.58579C16.7893 2.96086 17 3.46957 17 4V6H21C21.2652 6 21.5196 6.10536 21.7071 6.29289C21.8946 6.48043 22 6.73478 22 7C22 7.26522 21.8946 7.51957 21.7071 7.70711C21.5196 7.89464 21.2652 8 21 8H19.931L19.064 20.142C19.0281 20.6466 18.8023 21.1188 18.4321 21.4636C18.0619 21.8083 17.5749 22 17.069 22H6.93C6.42414 22 5.93707 21.8083 5.56688 21.4636C5.1967 21.1188 4.97092 20.6466 4.935 20.142L4.07 8H3C2.73478 8 2.48043 7.89464 2.29289 7.70711C2.10536 7.51957 2 7.26522 2 7C2 6.73478 2.10536 6.48043 2.29289 6.29289C2.48043 6.10536 2.73478 6 3 6H7V4ZM9 6H15V4H9V6ZM6.074 8L6.931 20H17.07L17.927 8H6.074ZM10 10C10.2652 10 10.5196 10.1054 10.7071 10.2929C10.8946 10.4804 11 10.7348 11 11V17C11 17.2652 10.8946 17.5196 10.7071 17.7071C10.5196 17.8946 10.2652 18 10 18C9.73478 18 9.48043 17.8946 9.29289 17.7071C9.10536 17.5196 9 17.2652 9 17V11C9 10.7348 9.10536 10.4804 9.29289 10.2929C9.48043 10.1054 9.73478 10 10 10ZM14 10C14.2652 10 14.5196 10.1054 14.7071 10.2929C14.8946 10.4804 15 10.7348 15 11V17C15 17.2652 14.8946 17.5196 14.7071 17.7071C14.5196 17.8946 14.2652 18 14 18C13.7348 18 13.4804 17.8946 13.2929 17.7071C13.1054 17.5196 13 17.2652 13 17V11C13 10.7348 13.1054 10.4804 13.2929 10.2929C13.48043 10.1054 13.7348 10 14 10Z"
                            fill="#FF2F2F"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

Task.propTypes = {
    task: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        completed: PropTypes.bool.isRequired,
        createdAt: PropTypes.string.isRequired, // Ожидаем строку, а не объект Date
    }).isRequired
};

export default Task;
