"use client"

import { register, signin } from '@/lib/api';
import { NextPage } from 'next';



const TestPage: NextPage = () => {

  const mode = "register"
  const formState = {
    email: "sp@gmail.com",
    password: "abc123",
    firstName: "san",
    lastName: "pat",
  }

  const handleSubmit = async (e:any) => {
      e.preventDefault();

      try {
        if (mode === "register") {
          await register(formState);
        } else {
          await signin(formState);
        }

      } catch (e) {
        console.log("error", e);
      } finally {
        console.log("registered successfully")
      }
    };

  // const createTable = async () => {
  //   try {
  //     const res = await fetch('/api/testCreateTable');
  //     console.log('Table created successfully',res);
  //   } catch (error) {
  //     console.error('Error creating table:', error);
  //   }
  // };

  return (
    <div>
      <h1>Test Page</h1>
      <button onClick={handleSubmit}>
        create table
      </button>
    </div>
  );
};

export default TestPage;
