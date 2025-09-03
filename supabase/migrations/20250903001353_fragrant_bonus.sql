/*
  # Crear tabla de notificaciones

  1. Nueva Tabla
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `type` (text) - 'like', 'comment', 'follow', 'message'
      - `content` (text)
      - `related_user_id` (uuid, foreign key to users, optional)
      - `related_post_id` (uuid, foreign key to posts, optional)
      - `is_read` (boolean, default false)
      - `created_at` (timestamp)

  2. Seguridad
    - Enable RLS en tabla `notifications`
    - Add policy para usuarios puedan ver sus notificaciones
    - Add policy para crear notificaciones
*/

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'message')),
  content text NOT NULL,
  related_user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  related_post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their notification read status"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);