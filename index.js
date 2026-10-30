import express, { response } from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Student from './models/student.js'
import studentRoutes from './routes/studentRoutes.js';

dotenv.config()

const app = express();


console.log('Express app initialized');

app.use(express.json());

// const PORT = Number(process.env.PORT) || 5000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    console.log('MongoDB connected successfully');

    const PORT = Number(process.env.PORT) || 5000;

    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    server.on('error', (error) => {
      console.error('Server failed to start:', error.message);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
  }
}
connectDB();

// mongoose.connect("mongodb+srv://<>:<>@cluster0.g2gllbo.mongodb.net/")
// .then(()=> console.log("MongoDB is connected"))

app.get('/', (req, res) => {
  res.send('Hello World, i am live')
})

app.use(studentRoutes);

app.get('/all-students', async (req, res) => {
  const students = await Student.find();

  res.status(200).json({
    status: true,
    count: students.length,
    message: "Students retrieved successfuly",
    data: students
  })
});

app.get('/student/:id', async (req, res) => {
  const studentId = req.params.id
  const student = await Student.findById(studentId);

  if (!student) {
    return res.status(404).json({
      status: false,
      message: 'Student Not Found'
    })
  }

  return res.status(200).json({
    status: true,
    data: student
  });
});

//update a student usiing PUT
app.put('/students/:id', async (req, res) => {
  const studentId = req.params.id;

  const { name, course, age, email } = req.body;
  if (!name || !course || !age || !email) {
    return res.status(400).json({
      status: false,
      message: "All student fields are required for PUT"
    })
  }

  const student = await Student.findByIdAndUpdate(studentId,
    { name, course, age, email },
    { new: true });

  if (!student) {
    return res.status(404).json({
      status: false,
      message: 'Student Not Found'
    })
  }

  res.status(200).json({
    status: true,
    message: 'Student record updated successfully',
    data: student
  })
})

//PATCH
app.patch('/students/:id', async (req, res) => {
  const studentId = req.params.id;
  const student = await Student.findByIdAndUpdate(studentId, req.body, { new: true });

  if (!student) {
    return res.status(404).json({
      status: false,
      message: 'Student Not Found'
    })
  }

  return res.status(200).json({
    status: true,
    message: 'Student updated successfully',
    data: student
  });
});

//DELETE
app.delete('/students/:id', async (req, res) => {
  const studentId = req.params.id;

  const student = await Student.findByIdAndDelete(studentId);
  if (!student) {
    return res.status(404).json({
      status: false,
      message: 'Student Not Found'
    })
  }

  return res.status(200).json({
    status: true,
    message: "Student deleted successfully",
    data: null
  })
});
