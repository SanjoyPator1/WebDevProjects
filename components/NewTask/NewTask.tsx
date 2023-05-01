import { useState } from "react";
import Modal from "react-modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RiAddCircleFill } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";
import { createNewTask, deleteTask, updateTask } from "@/lib/api";
import clsx from "clsx";
import { headerFont } from "@/lib/fonts";
import { TaskModel } from "@/model/databaseType";
import { TASK_STATUS } from "@/lib/constants";
import { MenuItem, Select } from "@mui/material";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

Modal.setAppElement("#modal");

interface Props {
  mode : "create" | "update";
  projectIdProp: string;
  taskDataProp?: TaskModel;
}

const NewTask = ({mode, projectIdProp,taskDataProp }: Props) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [status, setStatus] = useState(taskDataProp?.status ? taskDataProp.status : TASK_STATUS.NOT_STARTED);
  const [deleted, setDeleted] = useState(taskDataProp?.deleted ? taskDataProp.deleted : false);
  const [name, setName] = useState(taskDataProp?.name ? taskDataProp.name :"");
  const [description, setDescription] = useState(taskDataProp?.description ? taskDataProp.description :"");
  const [due, setDue] = useState(taskDataProp?.due? taskDataProp?.due.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);

  const taskId = taskDataProp?.id


  // Create inline loading UI
  const isMutating = isFetching || isPending;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsFetching(true);

    try {
      if(mode=="create"){
        await createNewTask(projectIdProp,name, description, due);
      }else{
        await updateTask(taskId, name, description ,status, due)
      }

      setIsFetching(false);

      startTransition(() => {
        router.refresh();
      });

      //reset all fields
      setStatus(TASK_STATUS.NOT_STARTED)
      setName("");
      setDeleted(false);
      setDescription("");
      setDue(new Date().toISOString().slice(0, 10));
      closeModal();
    } catch (error) {
      console.error("Error creating task:", error);
      setIsFetching(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    setIsFetching(true);
    console.log("handleDelete for task:", taskId);

    try {
      await deleteTask(taskId);
      setIsFetching(false);

      startTransition(() => {
        router.refresh();
      });

      closeModal();
    } catch (error) {
      console.error("Error deleting task:", error);
      setIsFetching(false);
    }
  };

  return (
    <div className="new-project-container1" style={{ width: "100%", justifyContent: "flex-end" }}>
      {mode=="create" ? 
        <Button variant="contained" onClick={openModal}>
          <RiAddCircleFill style={{ marginRight: "0.4em" }} /> Add task
        </Button>
        :
        <FiEdit onClick={openModal} style={{ marginRight: "0.4em",cursor:"pointer", color:"#4B92FF" }} />
      }
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="new-project-overlay"
        className="new-project-modal small-container"
      >
        <h1 style={{ textAlign: "left" }} className={clsx("header-font", headerFont.className)}>
          New Task
        </h1>
        <form className="new-project-form" onSubmit={handleSubmit} style={{ opacity: !isMutating ? 1 : 0.7 }}>
          <TextField
            variant="outlined"
            fullWidth
            className="new-task-input"
            label="Task Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            required
          />
          <TextField
            variant="outlined"
            fullWidth
            className="new-task-input"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
            required
          />
          <TextField
            variant="outlined"
            fullWidth
            className="new-task-input"
            label="Due Date"
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            disabled={isPending}
            required
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Status</InputLabel>
            <Select
              variant="outlined"
              fullWidth
              className="new-task-input"
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isPending}
            >
              <MenuItem value={TASK_STATUS.COMPLETED}>COMPLETED</MenuItem>
              <MenuItem value={TASK_STATUS.NOT_STARTED}>NOT STARTED</MenuItem>
              <MenuItem value={TASK_STATUS.IN_PROGRESS}>IN PROGRESS</MenuItem>
            </Select>
          </FormControl>
          <div className={clsx("row-flex-container")} style={{justifyContent:"space-between", width:"100%"}}>
          <Button variant="contained" type="submit">
          {mode=="create" ?"Create": "Update" }
          </Button>
          {taskId &&
            <Button variant="outlined" color="error" onClick={(e)=>handleDelete(taskDataProp?.id)}>
              Delete
            </Button>
}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NewTask;
