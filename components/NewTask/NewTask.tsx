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
import {
  DARK_BLUE_COLOR,
  DARK_RED_COLOR,
  RED_COLOR,
  SECONDARY_DISTANCE,
  TASK_STATUS,
} from "@/lib/constants";
import { MenuItem, Select } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { LoadingButton } from "@mui/lab";

Modal.setAppElement("#modal");

interface Props {
  mode: "create" | "update";
  projectIdProp: string;
  taskDataProp?: TaskModel;
}

const NewTask = ({ mode, projectIdProp, taskDataProp }: Props) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [status, setStatus] = useState(
    taskDataProp?.status ? taskDataProp.status : TASK_STATUS.NOT_STARTED
  );
  const [deleted, setDeleted] = useState(
    taskDataProp?.deleted ? taskDataProp.deleted : false
  );
  const [name, setName] = useState(taskDataProp?.name ? taskDataProp.name : "");
  const [description, setDescription] = useState(
    taskDataProp?.description ? taskDataProp.description : ""
  );
  const [due, setDue] = useState(
    taskDataProp?.due
      ? taskDataProp?.due.toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const taskId = taskDataProp?.id;

  // Create inline loading UI
  const isMutating = isFetching || isPending;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsFetching(true);

    try {
      if (mode == "create") {
        await createNewTask(projectIdProp, status, name, description, due);
      } else {
        await updateTask(taskId, name, description, status, due);
      }

      startTransition(() => {
        router.refresh();
      });

      setIsFetching(false);

      //reset all fields
      setStatus(TASK_STATUS.NOT_STARTED);
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
    setIsDeleting(true);
    console.log("handleDelete for task:", taskId);

    try {
      await deleteTask(taskId);
      setIsDeleting(false);

      startTransition(() => {
        router.refresh();
      });

      //reset all fields
      setStatus(TASK_STATUS.NOT_STARTED);
      setName("");
      setDeleted(false);
      setDescription("");
      setDue(new Date().toISOString().slice(0, 10));
      closeModal();
    } catch (error) {
      console.error("Error deleting task:", error);
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="new-project-container1"
      style={{ width: "100%", justifyContent: "flex-end" }}
    >
      {mode == "create" ? (
        <Button
          variant="contained"
          onClick={openModal}
          style={{ backgroundColor: DARK_BLUE_COLOR }}
        >
          <RiAddCircleFill style={{ marginRight: "0.4em" }} /> Add task
        </Button>
      ) : (
        <FiEdit
          onClick={openModal}
          style={{
            marginRight: "0.4em",
            cursor: "pointer",
            color: DARK_BLUE_COLOR,
          }}
        />
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="new-project-overlay"
        className="new-project-modal small-container"
      >
        <h1
          style={{ textAlign: "left" }}
          className={clsx("header-font", headerFont.className)}
        >
          {mode === "create" ? "New Task" : "Update Task"}
        </h1>
        <form
          className="new-project-form"
          onSubmit={handleSubmit}
          style={{ opacity: !isMutating ? 1 : 0.7, gap: SECONDARY_DISTANCE }}
        >
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
            multiline
            rows={4}
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
          <div
            className={clsx("row-flex-container")}
            style={{ justifyContent: "space-between", width: "100%" }}
          >
            <LoadingButton
              loading={isFetching}
              variant="contained"
              type="submit"
              style={{ backgroundColor: DARK_BLUE_COLOR }}
            >
              {mode == "create" ? "Create" : "Update"}
            </LoadingButton>
            {taskId && (
              <LoadingButton
                loading={isDeleting}
                variant="outlined"
                color="error"
                onClick={(e) => handleDelete(taskDataProp?.id)}
                style={{ backgroundColor: DARK_RED_COLOR, color: "white" }}
              >
                Delete
              </LoadingButton>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default NewTask;
