const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Configurações do banco de dados MySQL
const pool = mysql.createPool({
  host: "db", // Nome do serviço MySQL no Docker
  user: "root",
  password: "123456", // Deve ser o mesmo especificado em MYSQL_ROOT_PASSWORD
  database: "tarefasdb", // Nome do banco de dados
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Função para criar a tabela se não existir
async function createTable() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tarefas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(255) UNIQUE NOT NULL,
        custo DECIMAL(10, 2) NOT NULL,
        data_limite DATE NOT NULL,
        ordem_apresentacao INT UNIQUE NOT NULL
      );
    `);
    connection.release();
    console.log("Tabela 'tarefas' verificada/criada.");
  } catch (err) {
    console.error("Erro ao criar a tabela:", err);
  }
}

// Função para validar formato de data (YYYY-MM-DD)
function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regex)) return false;

  const date = new Date(dateString);
  const timestamp = date.getTime();
  if (typeof timestamp !== "number" || Number.isNaN(timestamp)) return false;

  return dateString === date.toISOString().split("T")[0];
}

// Rota para listar todas as tarefas
app.get("/tarefas", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM tarefas ORDER BY ordem_apresentacao"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para criar nova tarefa com validação de data
app.post("/tarefas", async (req, res) => {
  const { nome, custo, data_limite } = req.body;

  // Verifica se a data_limite é válida
  if (!isValidDate(data_limite)) {
    return res
      .status(400)
      .json({ error: "Data inválida. Use o formato YYYY-MM-DD." });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO tarefas (nome, custo, data_limite, ordem_apresentacao)
       VALUES (?, ?, ?, (SELECT COALESCE(MAX(ordem_apresentacao), 0) + 1 FROM (SELECT * FROM tarefas) AS t))`,
      [nome, custo, data_limite]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Rota para atualizar uma tarefa
app.put("/tarefas/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, custo, data_limite } = req.body;
  try {
    await pool.query(
      "UPDATE tarefas SET nome = ?, custo = ?, data_limite = ? WHERE id = ?",
      [nome, custo, data_limite, id]
    );
    res.json({ message: "Tarefa atualizada com sucesso" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Rota para excluir uma tarefa
app.delete("/tarefas/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM tarefas WHERE id = ?", [id]);
    res.json({ message: "Tarefa excluída com sucesso" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend rodando na porta ${PORT}`);
  createTable(); // Chama a função para criar a tabela ao iniciar o servidor
});
