import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://qxjkmwzwsjutfjhopanj.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjJjOGVmYTBkLWUyZTItNDJlYy04ZmI0LWY0MjRmNzJmMTMxNCJ9.eyJwcm9qZWN0SWQiOiJxeGprbXd6d3NqdXRmamhvcGFuaiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzgxODczNjg5LCJleHAiOjIwOTcyMzM2ODksImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0._WOBLppwiIjZoF8uQ8S9UhTOIsLAzq8xaVV2VFpEoPs';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };