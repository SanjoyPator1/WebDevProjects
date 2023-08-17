import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { Button } from "../ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog } from "@radix-ui/react-dialog";

interface FormFieldModel {
  label: string;
  inputType: string;
  inputId: string;
  isRequired?: boolean;
}

interface ProfileFormModel {
  buttonName: string;
  dialogTitle: string;
  dialogDescription?: string;
  formFieldsModelData: FormFieldModel[];
  initialValues: Record<string, string>;
  onFormDataChange: (newFormData: Record<string, string>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const EditDialog: React.FC<ProfileFormModel> = ({
  buttonName,
  dialogTitle,
  dialogDescription,
  formFieldsModelData,
  initialValues,
  onFormDataChange,
  handleSubmit,
}) => {
  const handleInputChange = (fieldId: string, newValue: string) => {
    const updatedData = { ...initialValues, [fieldId]: newValue };
    onFormDataChange(updatedData);
  };

  const handleSubmitFunction = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e);
    console.log("form submit done. closing dialog");
    document.getElementById('dialog-trigger-close')?.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MdEdit />
          <p className="ml-2">{buttonName}</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          {dialogDescription && (
            <DialogDescription>{dialogDescription}</DialogDescription>
          )}
        </DialogHeader>
        <form onSubmit={handleSubmitFunction}>
          <div className="grid gap-4 py-4">
            {formFieldsModelData.map((field) => (
              <div
                className="grid grid-cols-4 items-center gap-4"
                key={field.inputId}
              >
                <Label htmlFor={field.inputId} className="text-right">
                  {field.label}
                </Label>
                <Input
                  id={field.inputId}
                  type={field.inputType}
                  value={initialValues[field.inputId]}
                  required={field.isRequired || false}
                  onChange={(e) =>
                    handleInputChange(field.inputId, e.target.value)
                  }
                  className="col-span-3"
                />
              </div>
            ))}
          </div>
          <DialogTrigger id="dialog-trigger-close" />
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
