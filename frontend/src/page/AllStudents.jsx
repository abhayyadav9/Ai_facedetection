import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const AllStudents = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/users/get-all");
        const data = await response.json();
        console.log(data.users)
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 ">
      <motion.h1
        className="text-4xl font-bold text-center text-indigo-700 mb-10 mt-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        📚 All Students
      </motion.h1>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-2xl">
        <motion.table
          className="min-w-full border-collapse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">SNO.</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Roll Number</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Age</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
            </tr>
          </thead>
          <tbody>
            {students?.map((student, index) => (
              <motion.tr
                key={student._id}
                className="hover:bg-indigo-50 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{student.roll_number}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{student.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{student.email}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{student.age}</td>
                <td className="px-6 py-4">
                  {student.image ? (
                    <img
                        src={`data:image/jpeg;base64,${student.image}`}
                      alt={student.name}
                      className="h-12 w-12 rounded-full object-cover shadow-md border"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No Image</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>
    </div>
  );
};

export default AllStudents;
