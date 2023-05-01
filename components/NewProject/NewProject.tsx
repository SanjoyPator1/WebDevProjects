"use client";
import { useState } from "react";
import Modal from "react-modal";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import { useTransition } from "react";
import "./newProjectStyle.css"
import "@/styles/global.css"
import { RiAddCircleFill } from 'react-icons/ri';
import { createNewProject } from "@/lib/api";
import clsx from "clsx";
import { headerFont } from "@/lib/fonts";

Modal.setAppElement("#modal");

const NewProject = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [name, setName] = useState("");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);

    // Create inline loading UI
    const isMutating = isFetching || isPending;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsFetching(true);

    try {
        await createNewProject(name);

      setIsFetching(false);

      startTransition(() => {
        router.refresh();
      });
      setName("")
      closeModal();
    } catch (error) {
      console.error('Error creating project:', error);
      setIsFetching(false);
    }
  };

  return (
    <div className="new-project-container1" style={{width:"100%",justifyContent:"flex-end"}}>
      <Button  variant="contained" onClick={() => openModal()}><RiAddCircleFill style={{marginRight:"0.4em"}}/>Add Project</Button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="new-project-overlay"
        className="new-project-modal small-container"
      >
        <h1 style={{textAlign:"left"}} className={clsx("header-font",headerFont.className)}>New Project</h1>
        <form className="new-project-form" onSubmit={handleSubmit} style={{ opacity: !isMutating ? 1 : 0.7 }}>
            <TextField 
                variant="outlined"
                fullWidth
                className="new-project-input"
                label="project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
            />
          <Button variant="contained" type="submit">
            Create
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default NewProject;