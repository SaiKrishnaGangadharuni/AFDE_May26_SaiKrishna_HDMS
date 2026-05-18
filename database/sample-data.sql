-- =============================================================================
-- HDMS — Sample seed data (run after schema.sql)
-- Prefer `python backend/seed.py` — it inserts the same data with realistic
-- created_at timestamps spread across the past week.
-- =============================================================================

INSERT INTO tickets (employee_name, department, issue_category, description, priority, status, resolution_notes) VALUES
  ('Aarav Sharma',   'Engineering', 'VPN Issue',              'Unable to connect to corporate VPN since this morning.',         'High',     'In Progress', NULL),
  ('Bhavna Iyer',    'Finance',     'Password Reset',         'Forgot password for ERP system.',                                'Critical', 'Resolved',    'Password reset and shared via secure channel.'),
  ('Chetan Reddy',   'HR',          'Software Installation',  'Need MS Visio installed.',                                       'Low',      'Open',        NULL),
  ('Divya Menon',    'Engineering', 'Laptop Issue',           'Laptop battery drains within 30 minutes when unplugged.',        'Medium',   'In Progress', NULL),
  ('Esha Kapoor',    'Marketing',   'Email Access',           'Outlook keeps prompting for password every few minutes.',        'High',     'Resolved',    'Reset Outlook profile.'),
  ('Farhan Sheikh',  'Sales',       'Network Connectivity',   'WiFi disconnects intermittently in the conference room.',        'High',     'Open',        NULL),
  ('Gayatri Joshi',  'Operations',  'Hardware Request',       'Request for an additional 27-inch monitor.',                     'Low',      'Closed',      'Delivered to desk.'),
  ('Harshit Verma',  'Engineering', 'VPN Issue',              'VPN drops after 30 minutes of inactivity.',                      'Medium',   'In Progress', NULL),
  ('Ishita Nair',    'Finance',     'Software Installation',  'Need Tableau Desktop installed.',                                'Medium',   'Resolved',    'Installed and licensed.'),
  ('Jaideep Khanna', 'HR',          'Laptop Issue',           'Spacebar key stuck.',                                            'Low',      'Closed',      'Laptop replaced.');

-- =============================================================================
-- End of sample data.
-- =============================================================================
