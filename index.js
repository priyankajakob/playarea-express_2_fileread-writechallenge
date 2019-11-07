const express = require('express')
const fs = require('fs')
const app = express()
const port = 3010

app.use(express.json())

app.get('/', function (req, res) {
    res.send("welcome")
})

let studentsList = []

app.get('/students', function (req, res) {
    fs.readFile("./data/students.json", "utf-8", function (err, students) {
        if (err) {
            res.json({ errors: "error reading json file" })
        }
        else if (students) {
            students = JSON.parse(students)
            res.json(students)
            studentsList = [...students]
        }
    })
})

app.get('/students/:id', function (req, res) {
    const id = req.params.id
    fs.readFile("./data/students.json", "utf-8", function (err, students) {
        if (err) {
            res.json({ errors: "error reading json file" })
        }
        else if (students) {
            students = JSON.parse(students)
            const student = students.find(student => {
                return student.id === Number(id)
            })
            if (student) {
                res.json(student)
            }
            else {
                res.json({})
            }
        }
    })
})

app.post('/students', function (req, res) {
    const student = req.body
    const id = Number(new Date())
    Object.assign(student, { id })

    fs.readFile("./data/students.json", "utf-8", function (err, students) {
        if (err) {
            res.json({ errors: "error reading json file" })
        }
        else if (students) {
            students = JSON.parse(students)
            studentsList = [...students]
            studentsList.push(student)
            fs.writeFile("./data/students.json", JSON.stringify(studentsList), "utf-8", function (err) {
                if (err) {
                    res.json({ errors: "error writing to file" })
                }
                else {
                    res.json({ notice: "successfully added student", student })
                }
            })
        }
    })

})

app.put('/students/:id', function (req, res) {
    const id = req.params.id
    const studentUpd = req.body
    fs.readFile("./data/students.json", "utf-8", function (err, students) {
        if (err) {
            res.json({ errors: "error reading json file" })
        }
        else if (students) {
            students = JSON.parse(students)
            studentsList = [...students]
            studentsList.map(student => {
                if (student.id === Number(id)) {
                    Object.assign(student, studentUpd)
                } else {
                    Object.assign(student)
                }
            })
            const student = studentsList.find(student => {
                return student.id === Number(id)
            })
            if(student){
                fs.writeFile("./data/students.json", JSON.stringify(studentsList), "utf-8", function (err) {
                    if (err) {
                        res.json({ errors: "error writing to file" })
                    }
                    else {
                        res.json({ notice: "successfully modified student", student })
                    }
                })
            }
            else {
                res.json({})
            }
            
        }
    })
    
})

app.delete('/students/:id',function(req,res){
    const id=req.params.id
    fs.readFile("./data/students.json", "utf-8", function (err, students) {
        if (err) {
            res.json({ errors: "error reading json file" })
        }
        else if (students) {
            students = JSON.parse(students)
            studentsList = [...students]
            //to get the student to show which got deleted
            const student = studentsList.find(student => {
                return student.id === Number(id)
            })
            if(student){
                //to remove the student
                const list = studentsList.filter(student=> student.id!==Number(id))

                            
                fs.writeFile("./data/students.json", JSON.stringify(list), "utf-8", function (err) {
                    if (err) {
                        res.json({ errors: "error writing to file" })
                    }
                    else {
                        res.json({ notice: "successfully deleted student", student })
                    }
                })
            }
            else {
                res.json({})
            }
        }
    })


})

app.listen(port, () => {
    console.log("Listening on port ", port)
})



