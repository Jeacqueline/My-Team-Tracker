
INSERT INTO department(name)
VALUES  ("Sales"),
        ("Engineering"),
        ("Finance"),
        ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES("Lead Engineer", 190000, 2),
        ("Software Engineer", 135000, 2),
        ("Sales Lead", 110000,1),
        ("Salesperson", 98000,1),
        ("Legal Team Lead", 250000,4),
        ("Lawyer", 90000, 4),
        ("Accountant", 125000,3);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES  ("Jack","Rios",1, null),
        ("Den","Gonzalez",2, 1),
        ("Jean","Martinez",3,null),
        ("Moana","Muoi",4, 2),
        ("Saul", "Hudson",2,1),
        ("Axl","Rose",6,3),
        ("John", "Petrucci",5, null),
        ("Jack", "Skellington",7, null);

INSERT INTO managers(manager)
VALUES("Jack Rios"), ("Jean Martinez"), ("John Petrucci");

SELECT * FROM employee;

SELECT * FROM managers;

SELECT * FROM role;

SELECT * FROM department;

