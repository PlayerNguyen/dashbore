
-- Create a test database.
CREATE DATABASE IF NOT EXISTS dashbore_test;

-- Grant access to the dashbore_shadow database.
GRANT ALL PRIVILEGES ON *.* TO 'dashbore'@'%';

-- Flush privileges.
FLUSH PRIVILEGES;


