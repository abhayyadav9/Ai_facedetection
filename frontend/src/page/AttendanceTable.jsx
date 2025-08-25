import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetStudents, setSelectedStudent } from "../redux/slice/studentSlice";

const AttendanceTable = () => {
  const dispatch = useDispatch();

  // Get student data from Redux state
  const studentData = useSelector((state) => state.student.students);

  // Convert to an array (if not already)
  const studentList = Array.isArray(studentData)
    ? studentData
    : studentData && Object.keys(studentData).length > 0
    ? [studentData]
    : [];

  // Local state to track selected checkboxes using student's email as key.
  const [selected, setSelected] = useState({});

  // When studentList changes, initialize all checkboxes as checked (true).
  useEffect(() => {
    const defaultSelected = {};
    studentList.forEach((student) => {
      defaultSelected[student.email] = true;
    });
    setSelected(defaultSelected);
  }, [studentList]);

  // Toggle checkbox selection by student's email.
  const handleCheckboxChange = (email) => {
    setSelected((prev) => ({
      ...prev,
      [email]: !prev[email],
    }));
  };

  // Reset: clear the Redux selected student and re-check all checkboxes.
  const handleReset = () => {
    dispatch(resetStudents(null));
    const resetSelected = {};
    studentList.forEach((student) => {
      resetSelected[student.email] = true;
    });
    setSelected(resetSelected);
  };

  // Submission handler: filter out selected students.
  const handleSubmit = () => {
    const selectedStudents = studentList.filter(
      (student) => selected[student.email]
    );
    console.log("Submitting students:", selectedStudents);
    alert(`Submitted ${selectedStudents.length} student(s).`);
  };

  // Count the number of selected (ticked) checkboxes.
  const selectedCount = Object.values(selected).filter(Boolean).length;

  return (
    <div  className="flex flex-col">
       <div className=" bg-white shadow-lg rounded-lg  mt-11 ">
        <h2 className="text-2xl font-bold mb-4 text-center ">Student List</h2>
        <p className="text-center mb-4 font-medium text-gray-700">
          Total Selected: {selectedCount}
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Select
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sr. No.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentList.map((student, index) => (
                <tr key={student.email} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={!!selected[student.email]}
                      onChange={() => handleCheckboxChange(student.email)}
                      className="form-checkbox h-5 w-5 text-indigo-600"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {student?.image && (
                      <img
                        src={`data:image/jpeg;base64,${student.image}`}
                        alt="Profile"
                        className="w-16 h-16 object-cover rounded-full"
                      />
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.roll_number}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.email}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.age}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Action Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleReset}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
          >
            Reset
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
     
  );
};

export default AttendanceTable;
