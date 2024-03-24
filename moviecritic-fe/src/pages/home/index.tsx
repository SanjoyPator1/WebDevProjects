import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import MovieCard from '../../components/movieCard';
import { useGetAllMovies } from '../../services/api/movieApi';

const Home = () => {
  const [searchTermImmediate, setSearchTermImmediate] = useState('');
  const [searchTermDebounced, setSearchTermDebounced] = useState('');

  const { isLoading, error, data: movies, refetch } = useGetAllMovies(searchTermDebounced);

  const handleImmediateSearchChange = (value: string) => {
    setSearchTermImmediate(value);
  };

  const handleDebouncedSearchChange = debounce((value: string) => {
    setSearchTermDebounced(value);
  }, 500);

  useEffect(() => {
    handleDebouncedSearchChange(searchTermImmediate);
    
    return () => {
      handleDebouncedSearchChange.cancel();
    };
  }, [searchTermImmediate, handleDebouncedSearchChange]);

  useEffect(() => {
    refetch();
  }, [searchTermDebounced, refetch]);

  return (
    <div className='flex flex-col gap-4 h-full'>
      <h1 className="text-xl font-bold">Give rating to your movies</h1>
      
      <input
        type="text"
        placeholder="Search movies here ..."
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 max-w-96"
        value={searchTermImmediate}
        onChange={(e) => handleImmediateSearchChange(e.target.value)}
      />

      <div className="h-[70vh] overflow-y-auto">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error.message}</p>
        ) : movies && movies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No movies found</p>
        )}
      </div>
    </div>
  );
};

export default Home;
