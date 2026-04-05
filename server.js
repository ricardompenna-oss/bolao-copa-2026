const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// TESTE
app.get("/", (req, res) => {
  res.send("Bolão Copa 2026 rodando 🚀");
});

// CADASTRO
app.post("/register", async (req, res) => {
  const { login, name } = req.body;

  const { data: users } = await supabase.from("users").select("*");

  const isAdmin = users.length === 0;

  const { data, error } = await supabase.from("users").insert([
    {
      login,
      name,
      password: "COPADOMUNDO",
      is_admin: isAdmin,
    },
  ]);

  if (error) return res.status(400).json(error);

  res.json(data);
});

// LOGIN
app.post("/login", async (req, res) => {
  const { login } = req.body;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("login", login)
    .single();

  if (error) return res.status(404).json(error);

  res.json(data);
});

// LISTAR APOSTADORES
app.get("/users", async (req, res) => {
  const { data } = await supabase.from("users").select("*");
  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor rodando 🚀"));
