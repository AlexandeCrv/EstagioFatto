"use client";
import { useEffect, useState } from "react";
import {
  FaPencilAlt,
  FaTrash,
  FaCheck,
  FaTimes,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

export default function Home() {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState({
    nome: "",
    custo: "",
    data_limite: "",
  });
  const [tarefaEditando, setTarefaEditando] = useState(null);

  useEffect(() => {
    fetchTarefas();
  }, []);

  const fetchTarefas = async () => {
    const res = await fetch("http://localhost:3001/tarefas");
    const data = await res.json();
    setTarefas(data);
  };

  const handleAdicionarTarefa = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3001/tarefas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaTarefa),
    });
    setNovaTarefa({ nome: "", custo: "", data_limite: "" });
    fetchTarefas();
  };

  const handleExcluirTarefa = async (id) => {
    if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
      await fetch(`http://localhost:3001/tarefas/${id}`, { method: "DELETE" });
      fetchTarefas();
    }
  };

  const handleAtualizarTarefa = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:3001/tarefas/${tarefaEditando.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tarefaEditando),
    });
    setTarefaEditando(null);
    fetchTarefas();
  };

  // Função para reordenar as tarefassss
  const handleMoveTask = (index, direction) => {
    const newOrder = [...tarefas];
    const targetIndex = index + direction;

    if (targetIndex >= 0 && targetIndex < tarefas.length) {
      // Troca as tarefas de posiçãoooo
      [newOrder[index], newOrder[targetIndex]] = [
        newOrder[targetIndex],
        newOrder[index],
      ];
      setTarefas(newOrder);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
        Lista de Tarefas
      </h1>

      <form
        onSubmit={handleAdicionarTarefa}
        className="flex flex-col gap-4 mb-6"
      >
        <input
          type="text"
          placeholder="Nome"
          value={novaTarefa.nome}
          onChange={(e) =>
            setNovaTarefa({ ...novaTarefa, nome: e.target.value })
          }
          required
          className="px-4 py-2 border rounded focus:outline-none text-black focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          placeholder="Custo"
          value={novaTarefa.custo}
          onChange={(e) =>
            setNovaTarefa({ ...novaTarefa, custo: Math.max(0, e.target.value) })
          }
          required
          className="px-4 py-2 border rounded focus:outline-none text-black focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="date"
          value={novaTarefa.data_limite}
          onChange={(e) =>
            setNovaTarefa({ ...novaTarefa, data_limite: e.target.value })
          }
          required
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 text-black focus:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Adicionar Tarefa
        </button>
      </form>

      <div className="">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Nome</th>
              <th className="py-3 px-4 text-left">Custo</th>
              <th className="py-3 px-4 text-left">Data Limite</th>
              <th className="py-3 px-4 text-left">Ações</th>
              <th className="py-3 px-4 text-left">Mover</th>
            </tr>
          </thead>
          <tbody>
            {tarefas.map((tarefa, index) => (
              <tr
                key={tarefa.id}
                className={`${
                  tarefa.custo >= 1000 ? "bg-yellow-100" : "bg-white"
                } border-b transition duration-200 hover:bg-gray-50`}
              >
                {tarefaEditando?.id === tarefa.id ? (
                  <>
                    <td className="py-3 px-4">{tarefa.id}</td>
                    <td className="py-3 px-4">
                      <input
                        type="text"
                        value={tarefaEditando.nome}
                        onChange={(e) =>
                          setTarefaEditando({
                            ...tarefaEditando,
                            nome: e.target.value,
                          })
                        }
                        className="px-2 py-1 border rounded focus:outline-none text-black focus:ring-2 focus:ring-blue-400"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        value={tarefaEditando.custo}
                        onChange={(e) =>
                          setTarefaEditando({
                            ...tarefaEditando,
                            custo: Math.max(0, e.target.value),
                          })
                        }
                        className="px-2 py-1 border rounded focus:outline-none text-black focus:ring-2 focus:ring-blue-400"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <input
                        type="date"
                        value={tarefaEditando.data_limite}
                        onChange={(e) =>
                          setTarefaEditando({
                            ...tarefaEditando,
                            data_limite: e.target.value,
                          })
                        }
                        className="px-2 py-1 border rounded focus:outline-none focus:ring-2 text-black focus:ring-blue-400"
                      />
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        onClick={handleAtualizarTarefa}
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition"
                      >
                        <FaCheck className="w-5 h-5 inline" /> Salvar
                      </button>
                      <button
                        onClick={() => setTarefaEditando(null)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                      >
                        <FaTimes className="w-5 h-5 inline" /> Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-3 text-black px-4">{tarefa.id}</td>
                    <td className="py-3 text-black px-4">{tarefa.nome}</td>
                    <td className="py-3 text-black px-4">
                      R$ {tarefa.custo.toFixed(2)}
                    </td>
                    <td className="py-3 text-black px-4">
                      {tarefa.data_limite}
                    </td>
                    <td className="py-3 text-black px-4 flex gap-2">
                      <button
                        onClick={() => setTarefaEditando(tarefa)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                      >
                        <FaPencilAlt className="w-5 h-5 inline" /> Editar
                      </button>
                      <button
                        onClick={() => handleExcluirTarefa(tarefa.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                      >
                        <FaTrash className="w-5 h-5 inline" /> Excluir
                      </button>
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        onClick={() => handleMoveTask(index, -1)}
                        disabled={index === 0}
                        className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400 disabled:opacity-50"
                      >
                        <FaArrowUp className="w-5 h-5 inline" /> Subir
                      </button>
                      <button
                        onClick={() => handleMoveTask(index, 1)}
                        disabled={index === tarefas.length - 1}
                        className="bg-gray-300 text-black px-2 py-1 rounded hover:bg-gray-400 disabled:opacity-50"
                      >
                        <FaArrowDown className="w-5 h-5 inline" /> Descer
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
