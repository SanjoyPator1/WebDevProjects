"use client";
import { updateUser } from "@/lib/api";
import { DARK_BLUE_COLOR, SECONDARY_DISTANCE } from "@/lib/constants";
import { headerFont } from "@/lib/fonts";
import { UserModel } from "@/model/databaseType";
import { TextField } from "@mui/material";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import React, { memo, useState, useTransition } from "react";
import { LoadingButton } from "@mui/lab";
import "@/styles/global.css"

interface Props {
  userData: UserModel;
}

const ProfileForm = ({ userData }: Props) => {
  console.log("Profile user fname: " + userData.first_name);
  console.log("Profile user lname: " + userData.last_name);
  console.log("Profile user email: " + userData.email);

  const [firstName, setFirstName] = useState(
    userData?.first_name ? userData?.first_name : ""
  );
  const [lastName, setLastName] = useState(
    userData?.last_name ? userData?.last_name : ""
  );
  const [email, setEmail] = useState(userData?.email ? userData?.email : "");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Create inline loading UI
  const isMutating = isFetching || isPending;

  //updating user data
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsFetching(true);

    try {
      await updateUser(firstName, lastName, email);

      setIsFetching(false);

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Error updating user:", error);
      setIsFetching(false);
    }
  };

  return (
      <form
        className="form-card medium-container"
        onSubmit={handleSubmit}
        style={{ opacity: !isMutating ? 1 : 0.7 }}
      >
        <TextField
          variant="outlined"
          fullWidth
          className="new-task-input"
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={isPending}
          required
        />
        <TextField
          variant="outlined"
          fullWidth
          className="new-task-input"
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={isPending}
          required
        />
        <TextField
          variant="outlined"
          fullWidth
          className="new-task-input"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          required
        />
        <LoadingButton
          loading={isFetching}
          variant="contained"
          type="submit"
          style={{ backgroundColor: DARK_BLUE_COLOR }}
        >
          Save
        </LoadingButton>
      </form>
  );
};


export default memo(ProfileForm, (prev,next)=>{
    return prev.userData===next.userData
  });
