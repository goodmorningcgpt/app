CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "first_name" varchar,
  "last_name" varchar,
  "phone_number" varchar,
  "time_zone" varchar,
  "interests" varchar[]
);

CREATE TABLE "messages" (
  "id" integer PRIMARY KEY,
  "message" varchar,
  "user_id" integer
);

CREATE TABLE "sent_messages" (
  "id" integer PRIMARY KEY,
  "user_id" integer,
  "message_id" integer,
  "sent_at" timestamp
);

ALTER TABLE "messages" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "sent_messages" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "sent_messages" ADD FOREIGN KEY ("message_id") REFERENCES "messages" ("id");