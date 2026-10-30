import Student from '../models/student.js';


export const createStudent = async (req, res) => {
  try {
  const student = new Student(req.body);

  await student.save();

  res.status(201).json({
    status: true,
    message: 'Student created successfully',
    student: student
  });
} catch (error) {
  console.error('Error creating student:', error.message);

  if (error.code === 11000) {
    return res.status(409).json({
      status: false,
      message: 'Email or matriculation number already exists'
    });
  }

  return res.status(500).json({
    status: false,
    message: 'Failed to create student',
    error: error.message
  });
}
};