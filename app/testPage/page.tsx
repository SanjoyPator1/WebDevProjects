"use client"

import { NextPage } from 'next';

const TestPage: NextPage = () => {

  const createTable = async () => {
    try {
      const res = await fetch('/api/testCreateTable');
      console.log('Table created successfully',res);
    } catch (error) {
      console.error('Error creating table:', error);
    }
  };

  return (
    <div>
      <h1>Test Page</h1>
      <button onClick={createTable}>
        create table
      </button>
    </div>
  );
};

export default TestPage;
