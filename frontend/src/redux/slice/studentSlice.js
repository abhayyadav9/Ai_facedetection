import { createSlice } from '@reduxjs/toolkit';

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    students: [],
    selectedStudent: null,
  },
  reducers: {
    addStudent(state, action) {
      // Ensure state.students is an array; if not, reset it to an empty array.
      if (!Array.isArray(state.students)) {
        state.students = [];
      }
      // Append single or multiple students.
      if (Array.isArray(action.payload)) {
        state.students.push(...action.payload);
      } else {
        state.students.push(action.payload);
      }
    },
    resetStudents(state) {
      state.students = [];
      state.selectedStudent = null;
    },
    setSelectedStudent(state, action) {
      state.selectedStudent = action.payload;
    },
  },
});

export const { addStudent, resetStudents, setSelectedStudent } = studentSlice.actions;
export default studentSlice.reducer;
