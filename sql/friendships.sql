  DROP TABLE IF EXISTS friendships; 


  CREATE TABLE friendships( 
  id SERIAL PRIMARY KEY, 
  sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  accepted BOOLEAN DEFAULT false);
