import { useContext } from "react";
import { TaskContext } from "../context/TaskContext.jsx";

export default function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used inside TaskProvider");
  return ctx;
}
