import Counter from "../components/Counter.jsx";
import TaskForm from "../components/TaskForm.jsx";
import TaskList from "../components/TaskList.jsx";

export default function Home() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Mes Tâches</h1>
      <TaskForm />
      <Counter />
      <TaskList />
    </section>
  );
}
