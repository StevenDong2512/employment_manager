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
('Steven', 'D', 1, 1),
('Don', 'K', 2, 2),
('Artem', 'G', 3, 3),
('Faye', 'W', 4, 4),
('Chunli', 'H', 5, 5),
('Onyx', 'D', 6, 6),
('Alex', 'B', 7, 7),
('Kate', 'P', 8, 8),
