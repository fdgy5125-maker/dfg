/*
  # Create Mikrotik Management Database

  1. New Tables
    - `devices` - Mikrotik devices
    - `users` - User profiles
    - `subscriptions` - User subscriptions/plans
    - `invoices` - Billing invoices
    - `device_logs` - Device activity logs
    - `device_status` - Real-time device status

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for authenticated users
*/

-- Create devices table
CREATE TABLE IF NOT EXISTS devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  ip_address text NOT NULL UNIQUE,
  identity text,
  model text,
  os_version text,
  serial_number text,
  location text,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'online',
  last_seen timestamptz DEFAULT now(),
  cpu_load integer DEFAULT 0,
  memory_usage integer DEFAULT 0,
  uptime_seconds bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  full_name text,
  phone text,
  company_name text,
  address text,
  subscription_status text DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type text NOT NULL,
  price decimal(10,2) DEFAULT 0,
  max_devices integer DEFAULT 1,
  features jsonb DEFAULT '[]',
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  auto_renew boolean DEFAULT true,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  status text DEFAULT 'pending',
  issue_date timestamptz DEFAULT now(),
  due_date timestamptz,
  paid_date timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create device_logs table
CREATE TABLE IF NOT EXISTS device_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  action text NOT NULL,
  details text,
  created_at timestamptz DEFAULT now()
);

-- Create device_status table
CREATE TABLE IF NOT EXISTS device_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id uuid NOT NULL UNIQUE REFERENCES devices(id) ON DELETE CASCADE,
  cpu_usage decimal(5,2) DEFAULT 0,
  memory_usage decimal(5,2) DEFAULT 0,
  disk_usage decimal(5,2) DEFAULT 0,
  bandwidth_in decimal(15,2) DEFAULT 0,
  bandwidth_out decimal(15,2) DEFAULT 0,
  active_connections integer DEFAULT 0,
  last_updated timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_status ENABLE ROW LEVEL SECURITY;

-- Policies for devices
CREATE POLICY "Users can view their own devices"
  ON devices FOR SELECT
  TO authenticated
  USING (owner_id = auth.uid());

CREATE POLICY "Users can create devices"
  ON devices FOR INSERT
  TO authenticated
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own devices"
  ON devices FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can delete their own devices"
  ON devices FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Policies for users
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policies for invoices
CREATE POLICY "Users can view their own invoices"
  ON invoices FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policies for device_logs
CREATE POLICY "Users can view logs for their devices"
  ON device_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM devices
      WHERE devices.id = device_logs.device_id
      AND devices.owner_id = auth.uid()
    )
  );

-- Policies for device_status
CREATE POLICY "Users can view status for their devices"
  ON device_status FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM devices
      WHERE devices.id = device_status.device_id
      AND devices.owner_id = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_devices_owner_id ON devices(owner_id);
CREATE INDEX IF NOT EXISTS idx_devices_status ON devices(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_device_logs_device_id ON device_logs(device_id);
CREATE INDEX IF NOT EXISTS idx_device_logs_created_at ON device_logs(created_at);
