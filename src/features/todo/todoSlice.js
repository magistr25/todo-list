import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    tasks: [],
    selectedTaskId: null,
    filter: 'all',
};

const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        addTask: (state, action) => {
            state.tasks.push(action.payload);
        },
        toggleTaskStatus: (state, action) => {
            const task = state.tasks.find((task) => task.id === action.payload);
            if (task) {
                task.completed = !task.completed;
            }
        },
        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter((task) => task.id !== action.payload);
        },
        editTask: (state, action) => {
            const {id, title} = action.payload;
            const task = state.tasks.find((task) => task.id === id);
            if (task) {
                task.title = title;
            }
        },
        selectTask: (state, action) => {
            state.selectedTaskId = action.payload;
        },
        deselectTask: (state) => {
            state.selectedTaskId = null;
        },
        setFilter: (state, action) => {
            state.filter = action.payload;
        },
        resetEditing: (state) => {
            state.selectedTaskId = null;
        },
        reorderTasks: (state, action) => {
            state.tasks = action.payload;
        },
    },
});

export const { addTask, toggleTaskStatus, deleteTask, editTask,resetEditing, selectTask, deselectTask, setFilter, reorderTasks  } = todoSlice.actions;

export default todoSlice.reducer;
