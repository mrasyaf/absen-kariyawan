/*
  SUPABASE SQL SETUP
  
  Copy and paste this SQL into your Supabase SQL Editor:

  -- 1. Create Profiles Table
  CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'guru', 'staff')) DEFAULT 'staff',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  );

  -- 2. Create Students Table
  CREATE TABLE students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nis TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    class TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
  );

  -- 3. Create Employee Attendance Table
  CREATE TABLE employee_attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status TEXT CHECK (status IN ('hadir', 'sakit', 'izin', 'alpa')) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(profile_id, date)
  );

  -- 4. Create Student Attendance Table
  CREATE TABLE student_attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    status TEXT CHECK (status IN ('hadir', 'sakit', 'izin', 'alpa')) NOT NULL,
    class TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(student_id, date)
  );

  -- 5. Enable Row Level Security (RLS)
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE students ENABLE ROW LEVEL SECURITY;
  ALTER TABLE employee_attendance ENABLE ROW LEVEL SECURITY;
  ALTER TABLE student_attendance ENABLE ROW LEVEL SECURITY;

  -- 6. Profiles Policies
  CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
  CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);
  CREATE POLICY "Admins can manage all profiles." ON profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

  -- 7. Students Policies
  CREATE POLICY "Students are viewable by authenticated users." ON students FOR SELECT USING (auth.uid() IS NOT NULL);
  CREATE POLICY "Admins can manage students." ON students FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

  -- 8. Employee Attendance Policies
  CREATE POLICY "Users can view own attendance." ON employee_attendance FOR SELECT USING (auth.uid() = profile_id);
  CREATE POLICY "Users can insert own attendance." ON employee_attendance FOR INSERT WITH CHECK (auth.uid() = profile_id);
  CREATE POLICY "Admins can view all employee attendance." ON employee_attendance FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

  -- 9. Student Attendance Policies
  CREATE POLICY "Teachers and admins can view student attendance." ON student_attendance FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'guru'))
  );
  CREATE POLICY "Teachers and admins can insert student attendance." ON student_attendance FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'guru'))
  );

  -- 10. Trigger for new user profile
  -- This function creates a profile entry when a new user signs up
  CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
      new.id, 
      new.email, 
      COALESCE(new.raw_user_meta_data->>'full_name', 'User Baru'),
      COALESCE(new.raw_user_meta_data->>'role', 'staff')
    );
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

  -- 11. Initial Admin Setup (Optional)
  -- The first user to sign up will be 'staff' by default unless you manually change their role to 'admin' in the database.
*/
