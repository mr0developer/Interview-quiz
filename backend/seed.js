const db = require('./db');

const departments = ["Sales", "IT", "HR", "Marketing"];
const jobCategories = ["Manager", "Developer", "Analyst", "Intern"];

function seed() {
  departments.forEach((name) => {
    db.prepare("INSERT INTO departments (name) VALUES (?)").run(name);
  });
  jobCategories.forEach((name) => {
    db.prepare("INSERT INTO job_categories (name) VALUES (?)").run(name);
  });
  console.log("✅ Seeding complete! Departments and Job Categories added.");
}

seed();
