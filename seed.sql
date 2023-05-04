INSERT INTO department (department)
VALUES 
('Executive'),
('HR'),
('Marketing'),
('Finance'),
('IT'),
('Legal'),
('Creative'),
('Operation');

INSERT INTO role (title, salary, department_id)
VALUES 
('CEO', 800000.00, 1),
('People Lead', 150000.00, 2),
('Marketing Lead', 170000.00, 3),
('CFO', 200000.00, 4),
('IT Lead', 160000.00, 5),
('Legal Manager', 120000.00, 6),
('Creative Lead', 150000.00, 7),
('COO', 190000.00, 8);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Steven', 'Dong', 1, 1),
('Mark', 'Seeto', 2, 8),
('Philip', 'Engelberts', 3, 3),
('Janel', 'Tumpalan', 4, 4),
('Matthew', 'Taylor', 5, 5),
('Ivan', 'Elhen', 6, 8),
('Artem', 'Gorobets', 7, 8),
('Donald', 'Knowles', 8, 8);