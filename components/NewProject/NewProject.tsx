"use client";
import { createNewProject } from "@/lib/api";
import { useState } from "react";
import Modal from "react-modal";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import "./newProjectStyle.css"
import "@/styles/global.css"
import { RiAddCircleFill } from 'react-icons/ri';

Modal.setAppElement("#modal");

const NewProject = () => {
  const [modalIsOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createNewProject(name);
    closeModal();
  };

  return (
    <div className="new-project-container1" style={{width:"100%",justifyContent:"flex-end"}}>
      <Button  variant="contained" onClick={() => openModal()}><RiAddCircleFill style={{mariginRight:"0.4em"}}/>Add Project</Button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        overlayClassName="new-project-overlay"
        className="new-project-modal small-container"
      >
        <h1 style={{textAlign:"left"}} className="header-font">New Project</h1>
        <form className="new-project-form" onSubmit={handleSubmit}>
            <TextField 
                variant="outlined"
                fullWidth
                className="new-project-input"
                label="project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
