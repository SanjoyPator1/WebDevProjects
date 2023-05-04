"use client";
import { useState } from "react";
import Modal from "react-modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import "./newProjectStyle.css";
import "@/styles/global.css";
import { RiAddCircleFill } from "react-icons/ri";
import { createNewProject, deleteProject, updateProject } from "@/lib/api";
import clsx from "clsx";
import { headerFont } from "@/lib/fonts";
import {
  DARK_BLUE_COLOR,
  DARK_COLOR,
  DARK_RED_COLOR,
  SECONDARY_DISTANCE,
} from "@/lib/constants";
import { ProjectModel } from "@/model/databaseType";
import { FiEdit } from "react-icons/fi";
import { LoadingButton } from "@mui/lab";

Modal.setAppElement("#modal");

interface Props {
  mode: "create" | "update";
  projectDataProp?: ProjectModel;
}

const NewProject = ({ mode, projectDataProp }: Props) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [name, setName] = useState(
    projectDataProp?.project_name ? projectDataProp.project_name : ""
  );
  const [description, setDescription] = useState(
    projectDataProp?.description ? projectDataProp.description : ""
  );
  const [due, setDue] = useState(
    projectDataProp?.due
      ? projectDataProp?.due.toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Create inline loading UI
  const isMutating = isFetching || isPending;

  //creating and updating project
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsFetching(true);

    try {
      if (mode == "create") {
        await createNewProject(name, description, due);
      } else {
        await updateProject(projectDataProp.id, name, description, due);
      }

      setIsFetching(false);

      startTransition(() => {
        router.refresh();
      });

      //reset all fields
      setName("");
      setDescription("");
      setDue(new Date().toISOString().slice(0, 10));

      closeModal();
    } catch (error) {
      console.error("Error creating project:", error);
      setIsFetching(false);
    }
  };

  //deleting project
  const handleDelete = async (projectId: string) => {
    setIsFetching(true);
    console.log("handleDelete for project:", projectId);

    try {
      await deleteProject(projectId);
      setIsDeleting(false);

      startTransition(() => {
        router.refresh();
      });

      //reset all fields
      setName("");
      setDescription("");
      setDue(new Date().toISOString().slice(0, 10));

      closeModal();
    } catch (error) {
      console.error("Error deleting project:", error);
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
          <RiAddCircleFill style={{ marginRight: "0.4em" }} /> Add Project
        </Button>
      ) : (
        <Button
          variant="outlined"
          onClick={openModal}
          style={{ backgroundColor: DARK_COLOR, color: "white" }}
        >
          <FiEdit onClick={openModal} style={{ marginRight: "0.4em" }} /> Edit
          project
        </Button>
      )}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="new-project-overlay"
        className="new-project-modal modal-container"
      >
        <h1
          style={{ textAlign: "left" }}
          className={clsx("header-font", headerFont.className)}
        >
          {mode === "create" ? "New Project" : "Update Project"}
        </h1>
        <form
          className="new-project-form"
          onSubmit={handleSubmit}
          style={{ opacity: !isMutating ? 1 : 0.7, gap: SECONDARY_DISTANCE }}
        >
          <TextField
            variant="outlined"
            fullWidth
            className="new-project-input"
            label="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
          />
          <TextField
            variant="outlined"
            fullWidth
            className="new-project-input"
            label="Description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
          />
          <TextField
            variant="outlined"
            fullWidth
            className="new-project-input"
            label="Due Date"
            type="date"
            value={due}
            onChange={(e) => setDue(e.target.value)}
            disabled={isPending}
            required
          />
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
            {mode == "update" && (
              <LoadingButton
                loading={isDeleting}
                variant="outlined"
                color="error"
                onClick={(e) => handleDelete(projectDataProp?.id)}
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

export default NewProject;
