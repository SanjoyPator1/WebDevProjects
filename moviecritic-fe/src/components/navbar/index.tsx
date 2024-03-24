import { useState } from "react";
import AddMovieModal from "../addMovieModal";
import AddReviewModal from "../addReviewModal";
import { Link } from "react-router-dom";

const NavBar = () => {
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);

  const openAddMovieModal = () => {
    setShowAddMovieModal(true);
  };

  const closeAddMovieModal = () => {
    setShowAddMovieModal(false);
  };

  const openAddReviewModal = () => {
    setShowAddReviewModal(true);
  };

  const closeAddReviewModal = () => {
    setShowAddReviewModal(false);
  };

  return (
    <div className="flex justify-between p-2 z-20 bg-blue-400">
      <div className="p-2">
        <Link to="/">
          <p className="fontsemi-bold text-2xl text-white">Movie Rating</p>
        </Link>
      </div>
      <div className="p-2 flex gap-3">
        <button
          className="p-2 text-blue-600 bg-white border border-blue-600 rounded-sm shadow-md"
          onClick={openAddMovieModal}
        >
          Add new movie
        </button>
        <button
          className="p-2 bg-blue-600 text-white rounded-sm shadow-md"
          onClick={openAddReviewModal}
        >
          Add new review
        </button>
        {showAddMovieModal && <AddMovieModal mode="add" onClose={closeAddMovieModal} />}
        {showAddReviewModal && <AddReviewModal mode="add" onClose={closeAddReviewModal} />}
      </div>
    </div>
  );
};

export default NavBar;
