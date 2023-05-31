INSERT INTO department (id, name)
VALUES  (1, 'HR'),
        (2, 'Sales'),
        (3, 'Engineering'),
        (4,'Finance'),
        (5, 'Legal');

INSERT INTO role (id, title, salary, department_id)
VALUES  (10, 'HR Manager', 120000, 1),
        (11, 'HR Assistant', 85000, 1),
        (20, 'Sales Director', 150000, 2),
        (21, 'Salesperson', 50000, 2),
        (30, 'Lead Engineer', 165000, 3),
        (31, 'Junior Engineer', 100000, 3),
        (40, 'Lead Accountant', 80000, 4),
        (41, 'Accountant', 60000, 4),
        (50, 'General Counsel', 150000, 5),
        (51, 'Paralegal', 70000, 5);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES  (101, 'Toby', 'Flenderson', 10, NULL),
        (102, 'Kelly', 'Kapoor', 11, 1001),
        (103, 'Michael', 'Scott', 20, NULL),
        (104, 'Jim', 'Halpert', 21, 1003),
        (105, 'David', 'Wallace', 30, NULL),
        (106, 'Jan', 'Levinson', 31, 1005),
        (107, 'Angela', 'Martin', 40, NULL),
        (108, 'Kevin', 'Malone', 41, 1007),
        (109, 'Pam', 'Beesly', 50, NULL),
        (110, 'Creed', 'Bratton', 51, 1009);